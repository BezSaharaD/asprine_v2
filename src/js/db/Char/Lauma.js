import { Condition } from "../../classes/Condition";
import { ConditionAscensionChar } from "../../classes/Condition/Ascension/Char";
import { ConditionStatic } from "../../classes/Condition/Static";
import { DbObjectChar } from "../../classes/DbObject/Char";
import { DbObjectConstellation } from "../../classes/DbObject/Constellation";
import { DbObjectTalents } from "../../classes/DbObject/Talents";
import { FeaturePostEffectValue } from "../../classes/Feature2/PostEffectValue";
import { PostEffectStatsAtk } from "../../classes/PostEffect/Stats/Atk";
import { StatTable } from "../../classes/StatTable";
import { ValueTable } from "../../classes/ValueTable";
import { charTables } from "../generated/CharTables";
import { charTalentTables } from "../generated/CharTalentTables";

const Talents = new DbObjectTalents({
    attack: {
        gameId: charTalentTables.Lauma?.s1_id || 11191,
        title: 'talent_name.lauma_linnunrata',
        description: 'talent_descr.lauma_linnunrata',
        items: [],
    },
    skill: {
        gameId: charTalentTables.Lauma?.s2_id || 11192,
        title: 'talent_name.lauma_rune_song_karssiko',
        description: 'talent_descr.lauma_rune_song_karssiko',
        items: [],
    },
    burst: {
        gameId: charTalentTables.Lauma?.s3_id || 11195,
        title: 'talent_name.lauma_rune_song_moon',
        description: 'talent_descr.lauma_rune_song_moon',
        items: [],
    },
    links: [],
});

const PassiveLunarBloomScale = 0.0175;
const PassiveLunarBloomScaleCap = 14;

const lunarBloomPost = new PostEffectStatsAtk({
    percent: new StatTable('lunarbloom_multi', [PassiveLunarBloomScale / 100]),
    statCap: new ValueTable([PassiveLunarBloomScaleCap]),
});

export const Lauma = new DbObjectChar({
    name: 'lauma',
    serializeId: 111,
    gameId: 10000119,
    iconClass: 'char-icon-lauma',
    rarity: 5,
    element: 'dendro',
    weapon: 'catalyst',
    origin: 'nodkrai',
    talents: Talents,
    statTable: charTables.Lauma || [],
    features: [
        new FeaturePostEffectValue({
            category: 'other',
            name: 'lauma_lunar_bloom_base',
            postEffect: lunarBloomPost,
            format: 'percent',
        }),
    ],
    conditions: [
        new Condition({
            settings: {
                allowed_lunarbloom: 1,
            },
        }),
        new ConditionStatic({
            title: 'talent_name.lauma_moon_blessing',
            description: 'talent_descr.lauma_moon_blessing',
            stats: {
                text_percent: PassiveLunarBloomScale,
                text_percent_max: PassiveLunarBloomScaleCap,
            },
        }),
        new ConditionStatic({
            title: 'talent_name.lauma_spring_ablution',
            description: 'talent_descr.lauma_spring_ablution',
            info: {ascension: 4},
            condition: new ConditionAscensionChar({ascension: 4}),
        }),
    ],
    postEffects: [lunarBloomPost],
    constellation: new DbObjectConstellation([
        {conditions: [new ConditionStatic({title: 'talent_name.lauma_c1', description: 'talent_descr.lauma_c1'})]},
        {conditions: [new ConditionStatic({title: 'talent_name.lauma_c2', description: 'talent_descr.lauma_c2'})]},
        {conditions: [new Condition({settings: {char_skill_burst_bonus: 3}})]},
        {conditions: [new ConditionStatic({title: 'talent_name.lauma_c4', description: 'talent_descr.lauma_c4'})]},
        {conditions: [new Condition({settings: {char_skill_elemental_bonus: 3}})]},
        {conditions: [new ConditionStatic({title: 'talent_name.lauma_c6', description: 'talent_descr.lauma_c6'})]},
    ]),
});
