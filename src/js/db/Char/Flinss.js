import { Condition } from "../../classes/Condition";
import { ConditionAscensionChar } from "../../classes/Condition/Ascension/Char";
import { ConditionBoolean } from "../../classes/Condition/Boolean";
import { ConditionConstellation } from "../../classes/Condition/Constellation";
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
        gameId: charTalentTables.Flinss?.s1_id || 11201,
        title: 'talent_name.flinss_demon_spear',
        description: 'talent_descr.flinss_demon_spear',
        items: [],
    },
    skill: {
        gameId: charTalentTables.Flinss?.s2_id || 11202,
        title: 'talent_name.flinss_ancient_rite',
        description: 'talent_descr.flinss_ancient_rite',
        items: [],
    },
    burst: {
        gameId: charTalentTables.Flinss?.s3_id || 11205,
        title: 'talent_name.flinss_ancient_ritual',
        description: 'talent_descr.flinss_ancient_ritual',
        items: [],
    },
    links: [],
});

const PassiveLunarScale = 0.7;
const PassiveLunarScaleCap = 14;
const A4AtkScale = 8;
const A4AtkScaleCap = 160;

const lunarPost = new PostEffectStatsAtk({
    percent: new StatTable('lunarcharged_multi', [PassiveLunarScale / 100]),
    statCap: new ValueTable([PassiveLunarScaleCap]),
});

export const Flinss = new DbObjectChar({
    name: 'flinss',
    serializeId: 110,
    gameId: 10000120,
    iconClass: 'char-icon-flinss',
    rarity: 5,
    element: 'electro',
    weapon: 'polearm',
    origin: 'nodkrai',
    talents: Talents,
    statTable: charTables.Flinss || [],
    features: [
        new FeaturePostEffectValue({
            category: 'other',
            name: 'flinss_lunar_bonus',
            postEffect: lunarPost,
            format: 'percent',
        }),
    ],
    conditions: [
        new Condition({
            settings: {
                allowed_lunarcharged: 1,
            },
        }),
        new ConditionStatic({
            title: 'talent_name.flinss_moon_blessing',
            description: 'talent_descr.flinss_moon_blessing',
            stats: {
                text_percent: PassiveLunarScale,
                text_percent_max: PassiveLunarScaleCap,
            },
        }),
        new ConditionStatic({
            title: 'talent_name.flinss_whispering_flame',
            description: 'talent_descr.flinss_whispering_flame',
            info: {ascension: 4},
            stats: {
                text_percent: A4AtkScale,
                text_max: A4AtkScaleCap,
            },
            condition: new ConditionAscensionChar({ascension: 4}),
        }),
    ],
    postEffects: [lunarPost],
    constellation: new DbObjectConstellation([
        {conditions: [new ConditionStatic({title: 'talent_name.flinss_c1', description: 'talent_descr.flinss_c1'})]},
        {conditions: [new ConditionStatic({title: 'talent_name.flinss_c2', description: 'talent_descr.flinss_c2'})]},
        {conditions: [new Condition({settings: {char_skill_burst_bonus: 3}})]},
        {conditions: [new ConditionStatic({title: 'talent_name.flinss_c4', description: 'talent_descr.flinss_c4'})]},
        {conditions: [new Condition({settings: {char_skill_elemental_bonus: 3}})]},
        {conditions: [new ConditionStatic({title: 'talent_name.flinss_c6', description: 'talent_descr.flinss_c6'})]},
    ]),
});
