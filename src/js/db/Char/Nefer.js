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

const t = charTalentTables.Nefer;

const Talents = new DbObjectTalents({
    attack: {
        gameId: t?.s1_id || 11221,
        title: 'talent_name.nefer_snake_strike',
        description: 'talent_descr.nefer_snake_strike',
        items: [
            { table: new StatTable('normal_hit_1', t?.s1?.p1 || []) },
            { table: new StatTable('normal_hit_2', t?.s1?.p2 || []) },
            { table: new StatTable('normal_hit_3', t?.s1?.p3 || []) },
            { table: new StatTable('normal_hit_4', t?.s1?.p4 || []) },
            { table: new StatTable('charged_hit', t?.s1?.p5 || []) },
            { unit: 'unit', table: new StatTable('stamina_cost_sec', t?.s1?.p6 || []) },
            { unit: 'unit', table: new StatTable('stamina_cost_final', t?.s1?.p7 || []) },
            { unit: 'unit', table: new StatTable('stamina_cost_shadow', t?.s1?.p8 || []) },
            { table: new StatTable('plunge', t?.s1?.p9 || []) },
            { table: new StatTable('plunge_low', t?.s1?.p10 || []) },
            { table: new StatTable('plunge_high', t?.s1?.p11 || []) },
        ],
    },
    skill: {
        gameId: t?.s2_id || 11222,
        title: 'talent_name.nefer_senet_strategy',
        description: 'talent_descr.nefer_senet_strategy',
        items: [
            { table: new StatTable('nefer_skill_dmg_atk', t?.s2?.p1 || []) },
            { table: new StatTable('nefer_skill_dmg_em', t?.s2?.p2 || []) },
            { table: new StatTable('nefer_chimera_dmg_1_atk', t?.s2?.p3 || []) },
            { table: new StatTable('nefer_chimera_dmg_1_em', t?.s2?.p4 || []) },
            { table: new StatTable('nefer_chimera_dmg_2_atk', t?.s2?.p5 || []) },
            { table: new StatTable('nefer_chimera_dmg_2_em', t?.s2?.p6 || []) },
            { table: new StatTable('nefer_chimera_shadow_1', t?.s2?.p7 || []) },
            { table: new StatTable('nefer_chimera_shadow_2', t?.s2?.p8 || []) },
            { table: new StatTable('nefer_chimera_shadow_3', t?.s2?.p9 || []) },
            { unit: '', table: new StatTable('nefer_chimera_uses', t?.s2?.p10 || []) },
            { unit: 'sec', table: new StatTable('nefer_shadow_duration', t?.s2?.p11 || []) },
            { unit: 'sec', table: new StatTable('cd', t?.s2?.p12 || []) },
        ],
    },
    burst: {
        gameId: t?.s3_id || 11225,
        title: 'talent_name.nefer_sacred_oath',
        description: 'talent_descr.nefer_sacred_oath',
        items: [
            { table: new StatTable('nefer_burst_dmg_1_atk', t?.s3?.p1 || []) },
            { table: new StatTable('nefer_burst_dmg_1_em', t?.s3?.p2 || []) },
            { table: new StatTable('nefer_burst_dmg_2_atk', t?.s3?.p3 || []) },
            { table: new StatTable('nefer_burst_dmg_2_em', t?.s3?.p4 || []) },
            { table: new StatTable('nefer_burst_bonus', t?.s3?.p5 || []) },
            { unit: 'sec', table: new StatTable('cd', t?.s3?.p6 || []) },
            { unit: '', table: new StatTable('energy_cost', t?.s3?.p7 || []) },
        ],
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
        // Normal Attacks
        new FeatureDamageNormal({ name: 'normal_hit_1', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_1') }),
        ]}),
        new FeatureDamageNormal({ name: 'normal_hit_2', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_2') }),
        ]}),
        new FeatureDamageNormal({ name: 'normal_hit_3', element: 'dendro', hits: 2, multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_3') }),
        ]}),
        new FeatureDamageNormal({ name: 'normal_hit_4', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_4') }),
        ]}),
        new FeatureDamageCharged({ name: 'charged_hit', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.charged_hit') }),
        ]}),
        new FeatureDamagePlungeCollision({ name: 'plunge', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.plunge') }),
        ]}),
        new FeatureDamagePlungeShockWave({ name: 'plunge_low', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.plunge_low') }),
        ]}),
        new FeatureDamagePlungeShockWave({ name: 'plunge_high', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.plunge_high') }),
        ]}),
        // Skill
        new FeatureDamageSkill({ name: 'nefer_skill_dmg', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_elemental', values: Talents.get('skill.nefer_skill_dmg_atk') }),
            new FeatureMultiplier({ scaling: 'mastery*', leveling: 'char_skill_elemental', values: Talents.get('skill.nefer_skill_dmg_em') }),
        ]}),
        new FeatureDamageSkill({ name: 'nefer_chimera_dmg_1', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_elemental', values: Talents.get('skill.nefer_chimera_dmg_1_atk') }),
            new FeatureMultiplier({ scaling: 'mastery*', leveling: 'char_skill_elemental', values: Talents.get('skill.nefer_chimera_dmg_1_em') }),
        ]}),
        new FeatureDamageSkill({ name: 'nefer_chimera_dmg_2', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_elemental', values: Talents.get('skill.nefer_chimera_dmg_2_atk') }),
            new FeatureMultiplier({ scaling: 'mastery*', leveling: 'char_skill_elemental', values: Talents.get('skill.nefer_chimera_dmg_2_em') }),
        ]}),
        new FeatureDamageSkill({ name: 'nefer_chimera_shadow_3', element: 'dendro', multipliers: [
            new FeatureMultiplier({ scaling: 'mastery*', leveling: 'char_skill_elemental', values: Talents.get('skill.nefer_chimera_shadow_3') }),
        ]}),
        // Burst
        new FeatureDamageBurst({ name: 'nefer_burst_dmg_1', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_burst', values: Talents.get('burst.nefer_burst_dmg_1_atk') }),
            new FeatureMultiplier({ scaling: 'mastery*', leveling: 'char_skill_burst', values: Talents.get('burst.nefer_burst_dmg_1_em') }),
        ]}),
        new FeatureDamageBurst({ name: 'nefer_burst_dmg_2', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_burst', values: Talents.get('burst.nefer_burst_dmg_2_atk') }),
            new FeatureMultiplier({ scaling: 'mastery*', leveling: 'char_skill_burst', values: Talents.get('burst.nefer_burst_dmg_2_em') }),
        ]}),
        new FeaturePostEffectValue({
            category: 'other',
            name: 'nefer_lunar_bloom_base',
            postEffect: lunarBloomPost,
            format: 'percent',
        }),
    ],
    conditions: [
        new Condition({ settings: { allowed_lunarbloom: 1 } }),
        new ConditionStatic({
            title: 'talent_name.nefer_moon_blessing',
            description: 'talent_descr.nefer_moon_blessing',
            stats: { text_percent: PassiveLunarBloomScale, text_percent_max: PassiveLunarBloomScaleCap },
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
