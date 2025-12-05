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
        gameId: charTalentTables.Nefer?.s1_id || 11221,
        title: 'talent_name.nefer_snake_strike',
        description: 'talent_descr.nefer_snake_strike',
        items: [],
    },
    skill: {
        gameId: charTalentTables.Nefer?.s2_id || 11222,
        title: 'talent_name.nefer_senet_strategy',
        description: 'talent_descr.nefer_senet_strategy',
        items: [],
    },
    burst: {
        gameId: charTalentTables.Nefer?.s3_id || 11225,
        title: 'talent_name.nefer_sacred_oath',
        description: 'talent_descr.nefer_sacred_oath',
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

export const Nefer = new DbObjectChar({
    name: 'nefer',
    serializeId: 112,
    gameId: 10000122,
    iconClass: 'char-icon-nefer',
    rarity: 5,
    element: 'dendro',
    weapon: 'catalyst',
    origin: 'nodkrai',
    talents: Talents,
    statTable: charTables.Nefer || [],
    features: [
        new FeaturePostEffectValue({
            category: 'other',
            name: 'nefer_lunar_bloom_base',
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
            title: 'talent_name.nefer_moon_blessing',
            description: 'talent_descr.nefer_moon_blessing',
            stats: {
                text_percent: PassiveLunarBloomScale,
                text_percent_max: PassiveLunarBloomScaleCap,
            },
        }),
        new ConditionStatic({
            title: 'talent_name.nefer_daughter_of_dust',
            description: 'talent_descr.nefer_daughter_of_dust',
            info: {ascension: 4},
            condition: new ConditionAscensionChar({ascension: 4}),
        }),
    ],
    postEffects: [lunarBloomPost],
    constellation: new DbObjectConstellation([
        {conditions: [new ConditionStatic({title: 'talent_name.nefer_c1', description: 'talent_descr.nefer_c1'})]},
        {conditions: [new ConditionStatic({title: 'talent_name.nefer_c2', description: 'talent_descr.nefer_c2'})]},
        {conditions: [new Condition({settings: {char_skill_elemental_bonus: 3}})]},
        {conditions: [new ConditionStatic({title: 'talent_name.nefer_c4', description: 'talent_descr.nefer_c4'})]},
        {conditions: [new Condition({settings: {char_skill_burst_bonus: 3}})]},
        {conditions: [new ConditionStatic({title: 'talent_name.nefer_c6', description: 'talent_descr.nefer_c6'})]},
    ]),
});
