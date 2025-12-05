import { REAL_TOTAL } from "../db/Constants";
import { Artifact } from "./Artifact";
import { filterPostEffectTreeByStats } from "./Build/Data";
import { Condition } from "./Condition";
import { CBlock } from "./Feature2/Compile/Types";
import { FeatureCompiler } from "./Feature2/Compiler";
import { isPercent, Stats } from "./Stats";

const FEATURE_TYPE_INDEX = {
    'normal': 0,
    'crit': 1,
    'average': 2,
};

const DYNAMIC_STATS = ['crit_value'];

// Reusable objects pool for hot loop optimization
const statsPool = [];
const POOL_SIZE = 10;

function getPooledStats() {
    if (statsPool.length > 0) {
        const stats = statsPool.pop();
        stats.clear();
        return stats;
    }
    return new Stats();
}

function returnToPool(stats) {
    if (statsPool.length < POOL_SIZE) {
        statsPool.push(stats);
    }
}

export class ArtifactsSuggest {
    constructor(data) {
        this.build = data.build;
        this.artifacts = data.artifacts;
        this.featureName = data.featureName;
        this.featureType = data.featureType;
        this.settings = data.settings;
        this.limit = data.limit || 20;
    }

    prepare() {
        this.currentArts = this.build.getArtifacts();
        this.build.clearArtifacts();
        this.build.artifacts.modifySettings(this.settings.sets_settings);

        this.buildData = this.build.getBuildData();

        const baseConditions = this.build.getActiveConditions(this.buildData.settings);
        Condition.setCommonValues(this.buildData.settings, baseConditions);

        this.prepareArtifactSets();
        this.prepareDynamicStats();

        const compilerOpts = {
            ignoreSideEffects: 1,
            staticStats: [],
        };

        this.featureVariants = {};
        this.usedStats = [];
        const variationData = [];

        const statFilterUsedStats = [];
        const statsSettings = this.settings.stats || {};
        const statsKeys = Object.keys(statsSettings);
        
        for (let i = 0; i < statsKeys.length; i++) {
            let name = statsKeys[i].replace('_min', '').replace('_max', '');
            statFilterUsedStats.push(name);
            statFilterUsedStats.push(name + '_base');
            if (REAL_TOTAL.includes(name)) {
                statFilterUsedStats.push(name + '_percent');
            }
        }

        this.usedStats = this.usedStats.concat(statFilterUsedStats);

        const variations = this.getVariations();
        for (let v = 0; v < variations.length; v++) {
            const variant = variations[v];
            const vBuild = this.build.clone();
            const setSettings = Object.assign({}, this.settings.sets_settings);
            const variantNames = [];
            const artSetIds = [];

            for (let i = 0; i < variant.length; i++) {
                const vItem = variant[i];
                if (vItem.setId) {
                    variantNames.push(vItem.name);
                    setSettings[Artifact.settingName(vItem.setId)] = vItem.pieces;
                    for (let j = 0; j < vItem.pieces; j++) {
                        artSetIds.push(vItem.setId);
                    }
                }
            }

            const slots = DB.Artifacts.Slots.getKeys();
            for (let i = 0; i < slots.length; i++) {
                const setId = artSetIds.pop();
                if (!setId) break;
                const art = new Artifact(5, 20, slots[i], setId, '', []);
                vBuild.setArtifact(art);
            }

            const variandId = variantNames.sort().join('-') || 'default';
            vBuild.artifacts.modifySettings(setSettings);
            const vBuildData = vBuild.getBuildData();
            this.addDynamicStats(vBuildData.getActivePostEffectsTree());
            const feature = vBuild.getFeatureByName(this.featureName);

            if (feature.items) {
                this.addDynamicStatsFromItems(vBuildData, feature.items);
            }

            variationData.push({
                variandId: variandId,
                feature: feature,
                buildData: vBuildData,
            });
        }

        for (let i = 0; i < variationData.length; i++) {
            const item = variationData[i];
            const activePostTree = item.buildData.postEffectTreeByPriority();
            const postTrees = this.filterPostEffects(item.feature, item.buildData);

            const tree = item.feature.getTree(item.buildData, compilerOpts);
            const compiler = new FeatureCompiler(tree, postTrees);

            let usedStats = compiler.usedStats;
            this.usedStats = this.usedStats.concat(usedStats);
            usedStats = usedStats.concat(statFilterUsedStats);
            item.buildData.stats.ensure(usedStats);

            compilerOpts.staticStats = this.makeStaticStats(usedStats);

            compiler.prepare(item.buildData, compilerOpts);
            compiler.compile(compilerOpts);

            compiler.checkFunc = makeStatCheckFunc(this.settings.stats, activePostTree);

            this.featureVariants[item.variandId] = compiler;
        }

        this.buildData.stats.truncate(this.usedStats);
        this.buildData.stats.ensure(this.usedStats);

        this.prepareArtifacts();
    }

    getVariations() {
        const usedVariations = {};
        const variations = [];
        const setIds = Object.keys(this.setData);

        for (let i = 0; i < setIds.length; i++) {
            const setId = setIds[i];
            const piecesKeys = Object.keys(this.setData[setId]);
            
            for (let j = 0; j < piecesKeys.length; j++) {
                const pieces = piecesKeys[j];
                const data = this.setData[setId][pieces];
                if (data.variation && !usedVariations[data.variation]) {
                    usedVariations[data.variation] = 1;
                    variations.push({
                        name: data.variation,
                        setId: setId,
                        pieces: parseInt(pieces),
                    });
                }
            }
        }

        const variationCombinations = [[{name: 'default'}]];

        for (let i = 0; i < variations.length; i++) {
            const item1 = variations[i];
            variationCombinations.push([item1]);

            for (let j = i + 1; j < variations.length; j++) {
                const item2 = variations[j];
                if (item1.pieces + item2.pieces <= 5) {
                    variationCombinations.push([item1, item2]);
                }
            }
        }

        return variationCombinations;
    }

    filterPostEffects(feature, buildData) {
        if (feature.isRotation()) {
            return [];
        }

        const postItems = buildData.postEffectTreeByPriority();
        buildData.postEffects = [];
        const result = [];

        for (let i = 0; i < postItems.length; i++) {
            const items = postItems[i];
            const tree = feature.getTree(buildData);
            const compiler = new FeatureCompiler(tree, result);
            const usedStats = compiler.usedStats;

            for (let j = 0; j < items.length; j++) {
                const item = items[j];
                const assignedStats = item.getAssignedStats();
                for (let k = 0; k < assignedStats.length; k++) {
                    if (usedStats.includes(assignedStats[k])) {
                        result.push(item);
                        break;
                    }
                }
            }
        }

        return result;
    }

    prepareArtifacts() {
        this.slots = {
            flower: [],
            plume: [],
            sands: [],
            goblet: [],
            circlet: [],
        };
        this.setNames = {};
        this.totalCombinations = 1;

        for (let i = 0; i < this.artifacts.length; i++) {
            const art = this.artifacts[i];
            this.setNames[art.set] = 1;
            art.calcCache(this.usedStats);
            art.concatFunc = art.calculated.getConcatFunc();
            this.slots[art.slot].push(art);
        }

        const slotKeys = Object.keys(this.slots);
        for (let i = 0; i < slotKeys.length; i++) {
            const slot = slotKeys[i];
            if (this.slots[slot].length === 0) {
                const curArt = this.currentArts[slot];
                if (curArt) {
                    curArt.calcCache(this.usedStats);
                    this.slots[slot].push(curArt);
                } else {
                    const emptyArtifact = new Artifact(5, 0, slot, 'none', 'none', []);
                    emptyArtifact.isEmpty = true;
                    emptyArtifact.calculated = new Stats();
                    emptyArtifact.concatFunc = emptyArtifact.calculated.getConcatFunc();
                    this.slots[slot].push(emptyArtifact);
                }
            }
            this.totalCombinations *= this.slots[slot].length;
        }
    }

    prepareArtifactSets() {
        const setPieces = {};
        for (let i = 0; i < this.artifacts.length; i++) {
            const art = this.artifacts[i];
            if (!setPieces[art.set]) {
                setPieces[art.set] = {};
            }
            setPieces[art.set][art.slot] = 1;
        }

        const setMaxPieces = {};
        const setNames = Object.keys(setPieces);
        for (let i = 0; i < setNames.length; i++) {
            setMaxPieces[setNames[i]] = Object.keys(setPieces[setNames[i]]).length;
        }

        this.setData = {};
        const baseSettings = Object.assign({}, this.buildData.settings);
        const activePostEffects = this.buildData.getActivePostEffects().length;
        const setIds = DB.Artifacts.Sets.getKeys();

        for (let s = 0; s < setIds.length; s++) {
            const setId = setIds[s];
            const set = DB.Artifacts.Sets.get(setId);
            const bonuses = set.getConditionsByPieces();

            const setStats = new Stats();
            let setPostStats;
            const setTotalSettings = {};
            const artPiecesName = Artifact.settingNameShort(setId);
            const maxPieces = setMaxPieces[setId] || 0;

            const buildData = this.build.getBuildData();
            let prevActivePostEffects = activePostEffects;
            let featureVariation = '';

            for (let pieces = 1; pieces < bonuses.length; pieces++) {
                if (pieces > maxPieces) break;

                buildData.addSettings({[Artifact.settingName(setId)]: pieces});

                const conditions = bonuses[pieces];
                let pieceSettings = {};

                if (conditions.length) {
                    pieceSettings = Condition.allConditionsOn(conditions, baseSettings);
                    const pieceKeys = Object.keys(pieceSettings);
                    for (let k = 0; k < pieceKeys.length; k++) {
                        const key = pieceKeys[k];
                        if (baseSettings.hasOwnProperty(key)) {
                            pieceSettings[key] = baseSettings[key];
                        }
                    }
                    const localSettings = Object.assign({}, pieceSettings, baseSettings);

                    const stats = new Stats();
                    for (let c = 0; c < conditions.length; c++) {
                        const data = conditions[c].getData(localSettings);
                        stats.concat(data.stats);
                    }

                    setStats.concat(stats);
                    Object.assign(setTotalSettings, pieceSettings);
                    buildData.addSettings(pieceSettings);
                }

                const curActivePostEffects = buildData.getActivePostEffects().length;
                const curSerializableConditions = conditions.filter(i => i.isSerializable()).length;
                
                if (curActivePostEffects > prevActivePostEffects) {
                    prevActivePostEffects = curActivePostEffects;
                    featureVariation = artPiecesName + pieces;
                } else if (curSerializableConditions) {
                    featureVariation = artPiecesName + pieces;
                }

                if (Object.keys(setStats).length || setPostStats || featureVariation) {
                    const s = new Stats(setStats);
                    s.processPercent();

                    if (!this.setData[setId]) {
                        this.setData[setId] = {};
                    }

                    this.setData[setId][pieces] = {
                        stats: s,
                        variation: featureVariation,
                        concatFunc: s.getConcatFunc(),
                    };
                }
            }
        }
    }

    prepareDynamicStats() {
        const stats = {};
        const mainstats = DB.Artifacts.Mainstats.getKeys();
        const substats = DB.Artifacts.Substats.getKeys();

        for (let i = 0; i < mainstats.length; i++) {
            stats[mainstats[i]] = 1;
        }

        for (let i = 0; i < substats.length; i++) {
            stats[substats[i]] = 1;
        }

        const setIds = Object.keys(this.setData);
        for (let i = 0; i < setIds.length; i++) {
            const piecesKeys = Object.keys(this.setData[setIds[i]]);
            for (let j = 0; j < piecesKeys.length; j++) {
                const setStats = this.setData[setIds[i]][piecesKeys[j]].stats;
                const statKeys = Object.keys(setStats);
                for (let k = 0; k < statKeys.length; k++) {
                    if (!/^text_/.test(statKeys[k])) {
                        stats[statKeys[k]] = 1;
                    }
                }
            }
        }

        this.dynamicStats = Object.keys(stats);
    }

    addDynamicStats(items) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.stat && !this.dynamicStats.includes(item.stat)) {
                this.dynamicStats.push(item.stat);
            }
        }
    }

    addDynamicStatsFromItems(buildData, items) {
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            if (item.postEffects) {
                for (let j = 0; j < item.postEffects.length; j++) {
                    const post = item.postEffects[j];
                    if (post.getTree) {
                        this.addDynamicStats(post.getTree(buildData));
                    }
                }
            }

            if (item.items) {
                this.addDynamicStatsFromItems(buildData, item.items);
            }

            if (item.conditions) {
                this.addDynamicStatsFromItems(buildData, item.conditions);
            }
        }
    }

    makeStaticStats(usedStats) {
        const result = [];
        for (let i = 0; i < usedStats.length; i++) {
            const stat = usedStats[i];
            if (!this.dynamicStats.includes(stat) && !DYNAMIC_STATS.includes(stat)) {
                result.push(stat);
            }
        }
        return result;
    }

    getResult(callback) {
        const results = [];
        let minimalValue = 0;
        this.currentCombinations = 0;
        this.skippedCombinations = 0;

        const featureIndex = FEATURE_TYPE_INDEX[this.featureType];
        const initialStatFunc = this.buildData.stats.getSetFunc();
        
        // Pre-allocate reusable Stats object for hot loop
        const artStats = new Stats();
        const artSets = {};
        
        const generator = artifactCombinations(this.settings, this.setNames, this.slots, (val) => {
            this.currentCombinations += val;
            this.skippedCombinations += val;
            if (callback && (this.currentCombinations % 50000 === 0 || val > 50000)) {
                callback(this.currentCombinations, this.totalCombinations, this.skippedCombinations);
            }
        });

        callback(this.currentCombinations, this.totalCombinations, this.skippedCombinations);

        let combination;
        while ((combination = generator.next()) && !combination.done) {
            this.currentCombinations++;
            
            // Clear and reuse objects instead of creating new ones
            const setKeys = Object.keys(artSets);
            for (let i = 0; i < setKeys.length; i++) {
                artSets[setKeys[i]] = 0;
            }
            
            const artifacts = combination.value;
            
            // Clear stats object for reuse
            artStats.clear();
            initialStatFunc(artStats);

            // Process artifacts
            for (let i = 0; i < artifacts.length; i++) {
                const item = artifacts[i];
                if (item) {
                    artSets[item.set] = (artSets[item.set] || 0) + 1;
                    item.concatFunc(artStats);
                }
            }

            // Build variation string
            const variationParts = [];
            const artSetKeys = Object.keys(artSets);
            for (let i = 0; i < artSetKeys.length; i++) {
                const id = artSetKeys[i];
                const count = artSets[id];
                if (count === 0) continue;
                
                const sdata = this.setData[id] && this.setData[id][count];
                if (!sdata) continue;

                if (sdata.variation) {
                    variationParts.push(sdata.variation);
                }

                if (sdata.concatFunc) {
                    sdata.concatFunc(artStats);
                }
            }

            const variation = variationParts.length ? variationParts.sort().join('-') : 'default';
            const compiler = this.featureVariants[variation];

            // Check stat requirements
            if (!compiler.checkFunc || compiler.checkFunc(artStats)) {
                this.buildData.stats = artStats;
                const featureData = compiler.execute(this.buildData);
                const value = featureData[featureIndex] || 0;

                if (value >= minimalValue) {
                    // Only copy artifacts array when storing result
                    results.push({
                        value: value,
                        artifacts: artifacts.slice(),
                    });
                }
            } else {
                this.skippedCombinations++;
            }

            // Periodic maintenance
            if (callback && this.currentCombinations % 50000 === 0) {
                if (results.length > this.limit * 100) {
                    truncateResults(results, this.limit);
                    minimalValue = results[results.length - 1].value;
                }
                callback(this.currentCombinations, this.totalCombinations, this.skippedCombinations);
            }
        }

        callback(this.currentCombinations, this.totalCombinations, this.skippedCombinations);
        truncateResults(results, this.limit);
        removeEmptyArtifacts(results);

        return results;
    }
}

function* artifactCombinations(settings, setNames, slots, skipCallback) {
    let s1, s2, s3, s4, s5;

    const sets = {};
    const setNameKeys = Object.keys(setNames);
    for (let i = 0; i < setNameKeys.length; i++) {
        sets[setNameKeys[i]] = 0;
    }

    const checkFunc = generateCheckFunc(settings);
    const requireFunc = generateRequireFunc(settings);

    const skip5 = slots.circlet.length;
    const skip4 = skip5 * slots.goblet.length;
    const skip3 = skip4 * slots.sands.length;

    const flowers = slots.flower;
    const plumes = slots.plume;
    const sands = slots.sands;
    const goblets = slots.goblet;
    const circlets = slots.circlet;

    for (let i1 = 0; i1 < flowers.length; --sets[s1 ? s1.set : ''], ++i1) {
        s1 = flowers[i1];
        ++sets[s1.set];

        for (let i2 = 0; i2 < plumes.length; --sets[s2 ? s2.set : ''], ++i2) {
            s2 = plumes[i2];
            ++sets[s2.set];

            if (checkFunc(sets)) {
                skipCallback(skip3);
                continue;
            }

            for (let i3 = 0; i3 < sands.length; --sets[s3 ? s3.set : ''], ++i3) {
                s3 = sands[i3];
                ++sets[s3.set];

                if (checkFunc(sets)) {
                    skipCallback(skip4);
                    continue;
                }

                for (let i4 = 0; i4 < goblets.length; --sets[s4 ? s4.set : ''], ++i4) {
                    s4 = goblets[i4];
                    ++sets[s4.set];

                    if (checkFunc(sets)) {
                        skipCallback(skip5);
                        continue;
                    }

                    for (let i5 = 0; i5 < circlets.length; --sets[s5 ? s5.set : ''], ++i5) {
                        s5 = circlets[i5];
                        ++sets[s5.set];

                        if (checkFunc(sets) || requireFunc(sets)) {
                            skipCallback(1);
                            continue;
                        }

                        yield [s1, s2, s3, s4, s5];
                    }
                }
            }
        }
    }
}

function truncateResults(results, limit) {
    results.sort((a, b) => b.value - a.value);
    results.splice(limit);
}

function removeEmptyArtifacts(results) {
    for (let i = 0; i < results.length; i++) {
        const item = results[i];
        const arts = [];
        for (let j = 0; j < item.artifacts.length; j++) {
            if (!item.artifacts[j].isEmpty) {
                arts.push(item.artifacts[j]);
            }
        }
        item.artifacts = arts;
    }
}

function generateCheckFunc(settings) {
    const parts = [];
    const entries = Object.entries(settings.setMaxValues);
    for (let i = 0; i < entries.length; i++) {
        const [setName, pieces] = entries[i];
        parts.push('if(sets.' + setName + '>=' + pieces + ')return true');
    }
    parts.push('return false');
    return Function('sets', parts.join(';'));
}

function generateRequireFunc(settings) {
    const parts = [];
    const entries = Object.entries(settings.setMinValues);
    for (let i = 0; i < entries.length; i++) {
        const [setName, pieces] = entries[i];
        parts.push('if(sets.' + setName + '<' + pieces + ')return true');
    }
    parts.push('return false');
    return Function('sets', parts.join(';'));
}

function makeStatCheckFunc(settings, post) {
    const [parts, usedStats] = makeStatCheckParts(settings);
    if (parts.length === 0) return;

    let code = parts.join(';\n');

    const filtered = filterPostEffectTreeByStats(post, usedStats);
    if (filtered) {
        const [assign, revert] = FeatureCompiler.postTreeBlocks(filtered);
        const before = getBlockCode(assign);
        const after = getBlockCode(revert);
        code = before + ';\n' + code + ';\n' + after;
    }

    return Function('stats', code + ';\nreturn true');
}

function makeStatCheckParts(settings) {
    const parts = [];
    const usedStats = [];
    const keys = Object.keys(settings);

    for (let i = 0; i < keys.length; i++) {
        const name = keys[i];
        const match = /^(.*)_(min|max)$/.exec(name);
        if (!match) continue;
        
        const stat = match[1];
        const op = match[2];
        let value = settings[name];
        if (!value) continue;

        if (isPercent(stat)) {
            value /= 100;
        }

        let statStr;
        if (REAL_TOTAL.includes(stat)) {
            statStr = 'stats.' + stat + '_base*(1+stats.' + stat + '_percent)+stats.' + stat;
        } else {
            statStr = 'stats.' + stat + '_base+stats.' + stat;
        }

        if (!usedStats.includes(stat)) {
            usedStats.push(stat);
            usedStats.push(stat + '_base');
            if (REAL_TOTAL.includes(stat)) {
                usedStats.push(stat + '_percent');
            }
        }

        if (op === 'max') {
            parts.push('if(' + statStr + '>' + value + ')return false');
        } else if (op === 'min') {
            parts.push('if(' + statStr + '<' + value + ')return false');
        }
    }
    return [parts, usedStats];
}

function getBlockCode(items) {
    const compiler = new FeatureCompiler(new CBlock(items, {noReturn: true}), []);
    compiler.prepare();
    return compiler.getCode();
}
