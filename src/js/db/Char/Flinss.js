import { Condition } from "../../classes/Condition";
import { ConditionAscensionChar } from "../../classes/Condition/Ascension/Char";
import { ConditionStatic } from "../../classes/Condition/Static";
import { DbObjectChar } from "../../classes/DbObject/Char";
import { DbObjectConstellation } from "../../classes/DbObject/Constellation";
import { DbObjectTalents } from "../../classes/DbObject/Talents";
import { FeatureDamageBurst } from "../../classes/Feature2/Damage/Burst";
import { FeatureDamageCharged } from "../../classes/Feature2/Damage/Charged";
import { FeatureDamageNormal } from "../../classes/Feature2/Damage/Normal";
import { FeatureDamagePlungeCollision } from "../../classes/Feature2/Damage/Plunge/Collision";
import { FeatureDamagePlungeShockWave } from "../../classes/Feature2/Damage/Plunge/ShockWave";
import { FeatureDamageSkill } from "../../classes/Feature2/Damage/Skill";
import { FeatureMultiplier } from "../../classes/Feature2/Multiplier";
import { FeaturePostEffectValue } from "../../classes/Feature2/PostEffectValue";
import { PostEffectStatsAtk } from "../../classes/PostEffect/Stats/Atk";
import { StatTable } from "../../classes/StatTable";
import { ValueTable } from "../../classes/ValueTable";
import { charTables } from "../generated/CharTables";
import { charTalentTables } from "../generated/CharTalentTables";

const t = charTalentTables.Flinss;

const Talents = new DbObjectTalents({
    attack: {
        gameId: t?.s1_id || 11201,
        title: 'talent_name.flinss_demon_spear',
        description: 'talent_descr.flinss_demon_spear',
        items: [
            { table: new StatTable('normal_hit_1', t?.s1?.p1 || []) },
            { table: new StatTable('normal_hit_2', t?.s1?.p2 || []) },
            { table: new StatTable('normal_hit_3', t?.s1?.p3 || []) },
            { table: new StatTable('normal_hit_4', t?.s1?.p4 || []) },
            { table: new StatTable('normal_hit_5', t?.s1?.p5 || []) },
            { table: new StatTable('charged_hit', t?.s1?.p6 || []) },
            { unit: 'unit', table: new StatTable('stamina_cost', t?.s1?.p7 || []) },
            { table: new StatTable('plunge', t?.s1?.p8 || []) },
            { table: new StatTable('plunge_low', t?.s1?.p9 || []) },
            { table: new StatTable('plunge_high', t?.s1?.p10 || []) },
        ],
    },
    skill: {
        gameId: t?.s2_id || 11202,
        title: 'talent_name.flinss_ancient_rite',
        description: 'talent_descr.flinss_ancient_rite',
        items: [
            { table: new StatTable('flinss_storm_dmg', t?.s2?.p1 || []) },
            { unit: 'sec', table: new StatTable('flinss_storm_cd', t?.s2?.p2 || []) },
            { unit: 'sec', table: new StatTable('flinss_flame_duration', t?.s2?.p3 || []) },
            { unit: 'sec', table: new StatTable('cd', t?.s2?.p4 || []) },
        ],
    },
    burst: {
        gameId: t?.s3_id || 11205,
        title: 'talent_name.flinss_ancient_ritual',
        description: 'talent_descr.flinss_ancient_ritual',
        items: [
            { table: new StatTable('flinss_initial_dmg', t?.s3?.p1 || []) },
            { table: new StatTable('flinss_lunar_mid_dmg', t?.s3?.p2 || []) },
            { table: new StatTable('flinss_lunar_final_dmg', t?.s3?.p3 || []) },
            { unit: '', table: new StatTable('energy_cost', t?.s3?.p4 || []) },
            { unit: 'sec', table: new StatTable('cd', t?.s3?.p5 || []) },
            { table: new StatTable('flinss_symphony_dmg', t?.s3?.p6 || []) },
            { table: new StatTable('flinss_symphony_extra', t?.s3?.p7 || []) },
            { unit: '', table: new StatTable('flinss_symphony_energy', t?.s3?.p8 || []) },
        ],
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
        // Normal Attacks
        new FeatureDamageNormal({ name: 'normal_hit_1', element: 'electro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_1') }),
        ]}),
        new FeatureDamageNormal({ name: 'normal_hit_2', element: 'electro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_2') }),
        ]}),
        new FeatureDamageNormal({ name: 'normal_hit_3', element: 'electro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_3') }),
        ]}),
        new FeatureDamageNormal({ name: 'normal_hit_4', element: 'electro', hits: 2, multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_4') }),
        ]}),
        new FeatureDamageNormal({ name: 'normal_hit_5', element: 'electro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_5') }),
        ]}),
        new FeatureDamageCharged({ name: 'charged_hit', element: 'electro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.charged_hit') }),
        ]}),
        new FeatureDamagePlungeCollision({ name: 'plunge', element: 'electro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.plunge') }),
        ]}),
        new FeatureDamagePlungeShockWave({ name: 'plunge_low', element: 'electro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.plunge_low') }),
        ]}),
        new FeatureDamagePlungeShockWave({ name: 'plunge_high', element: 'electro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.plunge_high') }),
        ]}),
        // Skill
        new FeatureDamageSkill({ name: 'flinss_storm_dmg', element: 'electro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_elemental', values: Talents.get('skill.flinss_storm_dmg') }),
        ]}),
        // Burst
        new FeatureDamageBurst({ name: 'flinss_initial_dmg', element: 'electro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_burst', values: Talents.get('burst.flinss_initial_dmg') }),
        ]}),
        new FeatureDamageBurst({ name: 'flinss_lunar_final_dmg', element: 'electro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_burst', values: Talents.get('burst.flinss_lunar_final_dmg') }),
        ]}),
        new FeatureDamageBurst({ name: 'flinss_symphony_dmg', element: 'electro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_burst', values: Talents.get('burst.flinss_symphony_dmg') }),
        ]}),
        new FeatureDamageBurst({ name: 'flinss_symphony_extra', element: 'electro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_burst', values: Talents.get('burst.flinss_symphony_extra') }),
        ]}),
        new FeaturePostEffectValue({
            category: 'other',
            name: 'flinss_lunar_bonus',
            postEffect: lunarPost,
            format: 'percent',
        }),
    ],
    conditions: [
        new Condition({ settings: { allowed_lunarcharged: 1 } }),
        new ConditionStatic({
            title: 'talent_name.flinss_moon_blessing',
            description: 'talent_descr.flinss_moon_blessing',
            stats: { text_percent: PassiveLunarScale, text_percent_max: PassiveLunarScaleCap },
        }),
        new ConditionStatic({
            title: 'talent_name.flinss_whispering_flame',
            description: 'talent_descr.flinss_whispering_flame',
            info: {ascension: 4},
            stats: { text_percent: A4AtkScale, text_max: A4AtkScaleCap },
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
