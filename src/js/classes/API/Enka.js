import { Artifact } from "../Artifact";
import { CalcSet } from "../CalcSet";
import { prepareUid } from "./Uid";

// Try local proxy first, fallback to Enka API via CORS proxy
const API_URL_PROXY = '/back/proxy/enka/?uid=<uid>&hash=<hash>';
const API_URL_DIRECT = 'https://enka.network/api/uid/<uid>';
// CORS proxies for GitHub Pages deployment (fallback chain)
const CORS_PROXIES = [
    'https://corsproxy.io/?',
    'https://api.allorigins.win/raw?url=',
];

const SLOT_DATA = {
    'EQUIP_RING': 'goblet',
    'EQUIP_NECKLACE': 'plume',
    'EQUIP_DRESS': 'circlet',
    'EQUIP_BRACER': 'flower',
    'EQUIP_SHOES': 'sands',
};

export class EnkaApi {
    load(uid, hash, callback) {
        let preparedUid = prepareUid(uid);
        
        // Try proxy first
        this.loadFromProxy(preparedUid, hash, (data) => {
            if (data) {
                callback(data);
            } else {
                // Fallback to direct Enka API
                this.loadFromEnka(preparedUid, callback);
            }
        });
    }

    loadFromProxy(uid, hash, callback) {
        let xhr = new XMLHttpRequest();
        let url = API_URL_PROXY.replace('<uid>', uid);
        url = url.replace('<hash>', hash || '');

        xhr.open('GET', url);
        xhr.onload = () => {
            if (xhr.status === 200) {
                callback(this.processData(xhr.response));
            } else {
                callback(null);
            }
        };
        xhr.onerror = () => callback(null);
        xhr.send();
    }

    loadFromEnka(uid, callback, proxyIndex = 0) {
        if (proxyIndex >= CORS_PROXIES.length) {
            callback(null);
            return;
        }

        let xhr = new XMLHttpRequest();
        let enkaUrl = API_URL_DIRECT.replace('<uid>', uid);
        // Use CORS proxy to bypass CORS restrictions
        let url = CORS_PROXIES[proxyIndex] + encodeURIComponent(enkaUrl);

        xhr.open('GET', url);
        xhr.onload = () => {
            if (xhr.status === 200) {
                let result = this.processEnkaData(xhr.response);
                if (result) {
                    callback(result);
                } else {
                    // Try next proxy
                    this.loadFromEnka(uid, callback, proxyIndex + 1);
                }
            } else {
                // Try next proxy
                this.loadFromEnka(uid, callback, proxyIndex + 1);
            }
        };
        xhr.onerror = () => {
            // Try next proxy
            this.loadFromEnka(uid, callback, proxyIndex + 1);
        };
        xhr.send();
    }

    isValidUid(uid) {
        if (/^1?\d{9}$/.exec(uid)) {
            return true;
        } else if (/^\d/.exec(uid)) {
            return false;
        }

        return uid.length > 0;
    }

    processData(data) {
        let json;
        try {
            json = JSON.parse(data);
        } catch(e) {
            return null;
        }

        // let player = getPlayer(json);
        let characters = getChars(json) || [];
        let artifacts = [];

        for (let item of characters) {
            let charArts = item.set.getArtifacts();
            for (let slot of Object.keys(charArts)) {
                if (charArts[slot]) {
                    artifacts.push(charArts[slot].clone());
                }
            }
        }

        return {
            player: {
                hashes: getHashes(json),
            },
            characters: characters,
            artifacts: artifacts,
        };
    }

    // Process data directly from Enka API (different format)
    processEnkaData(data) {
        let json;
        try {
            json = JSON.parse(data);
        } catch(e) {
            return null;
        }

        let characters = getCharsFromEnka(json) || [];
        let artifacts = [];

        for (let item of characters) {
            let charArts = item.set.getArtifacts();
            for (let slot of Object.keys(charArts)) {
                if (charArts[slot]) {
                    artifacts.push(charArts[slot].clone());
                }
            }
        }

        return {
            player: {
                hashes: [],
            },
            characters: characters,
            artifacts: artifacts,
        };
    }
}

function getHashes(data) {
    return data.hashes;
}

function getPlayer(data) {
    try {
        let player = data.playerInfo;
        let avatarId = player.profilePicture.avatarId;
        let chars = [];

        if (Array.isArray(player.showAvatarInfoList)) {
            for (let char of player.showAvatarInfoList) {
                let charData = DB.Chars.getByGameId(char.avatarId);
                if (charData) {
                    chars.push({
                        char: charData,
                        level: char.level,
                    });
                }
            }
        }

        return {
            title: player.nickname,
            signature: player.signature,
            ar: player.level,
            avatar: DB.Chars.getByGameId(avatarId),
            chars: chars,
        }
    } catch(e) {}

    return;
}

function getChars(data) {
    if (!data.hasOwnProperty('builds')) {
        return;
    }

    let chars = data.builds;
    if (!Array.isArray(chars)) {
        return;
    }

    let result = [];
    for (let charData of chars) {
        let calcset = processChar(charData.data);
        if (calcset) {
            result.push({
                title: charData.name,
                set: calcset,
            });
        }
    }

    return result;
}

// Process characters from direct Enka API response
function getCharsFromEnka(data) {
    if (!data.hasOwnProperty('avatarInfoList')) {
        return [];
    }

    let chars = data.avatarInfoList;
    if (!Array.isArray(chars)) {
        return [];
    }

    let result = [];
    for (let charData of chars) {
        let calcset = processChar(charData);
        if (calcset) {
            let char = DB.Chars.getByGameId(charData.avatarId, charData.skillDepotId);
            let charName = char ? UI.Lang.get(char.getName()) : 'Unknown';
            result.push({
                title: charName,
                set: calcset,
            });
        }
    }

    return result;
}

function getPropValue(propMap, key) {
    if (!propMap || !propMap[key]) return 0;
    // Enka API может возвращать ival или val
    return parseInt(propMap[key].ival || propMap[key].val || 0);
}

function processChar(data) {
    try {
        let set = new CalcSet();

        set.setEnemy(DB.Enemies.getFirst().getFirst());
        set.setEnemyLevels({level: 90});

        let char = DB.Chars.getByGameId(data.avatarId, data.skillDepotId);
        if (!char) return;

        set.setChar(char);
        set.setCharLevels({
            level: Math.min(90, Math.max(1, getPropValue(data.propMap, '4001'))),
            ascension: Math.min(6, Math.max(0, getPropValue(data.propMap, '1002'))),
            constellation: Math.min(6, Math.max(0, data.talentIdList ? data.talentIdList.length : 0)),
        });

        let skillLevels = {}
        for (let skill of ['attack', 'skill', 'burst']) {
            let id = char.talents.getCategory(skill).gameId;
            skillLevels[skill] = data.skillLevelMap[id] || 1;
        }
        skillLevels.elemental = skillLevels.skill;
        set.setCharSkills(skillLevels);

        let weaponData;
        for (let item of data.equipList) {
            if (item.weapon) {
                weaponData = item
            }
        }

        if (weaponData) {
            let weapon = DB.Weapons.get(char.weapon).getByGameId(weaponData.itemId);
            if (weapon) {
                set.setWeapon(weapon);
                let refine = 1;
                for (let affixId of Object.keys(weaponData.weapon.affixMap)) {
                    refine = weaponData.weapon.affixMap[affixId] + 1;
                    break;
                }

                set.setWeaponLevels({
                    level: Math.min(90, Math.max(1, weaponData.weapon.level || 1)),
                    ascension: Math.min(6, Math.max(0, weaponData.weapon.promoteLevel || 0)),
                    refine: Math.min(5, Math.max(1, refine)),
                });
            }
        }

        let artifacts = listArtifacts(data.equipList);
        for (let art of artifacts) {
            set.setArtifact(art);
        }

        return set;
    } catch(e) {
        console.log(e)
    }
    return;
}

function listArtifacts(data) {
    let artifactData = [];
    let result = [];

    for (let item of data) {
        if (item.reliquary) {
            artifactData.push(item);
        }
    }

    for (let item of artifactData) {
        let mainStat = DB.Artifacts.Mainstats.getKeyIdGame(item.flat.reliquaryMainstat.mainPropId);
        let setId = DB.Artifacts.Sets.getKeyByItem(item.itemId);
        let slot = SLOT_DATA[item.flat.equipType];
        let rarity = item.flat.rankLevel;
        let level = item.reliquary.level - 1;

        let subStats = [];
        for (let ss of item.flat.reliquarySubstats) {
            let stat = DB.Artifacts.Substats.getKeyIdGame(ss.appendPropId);
            if (stat) {
                subStats.push({
                    stat: stat,
                    value: ss.statValue,
                });
            }
        }

        let art = new Artifact(rarity, level, slot, setId, mainStat, subStats);
        result.push(art);
    }

    return result;
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array
}
