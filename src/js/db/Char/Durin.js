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
import { StatTable } from "../../classes/StatTable";
import { charTables } from "../generated/CharTables";
import { charTalentTables } from "../generated/CharTalentTables";

const t = charTalentTables.Durin;

const Talents = new DbObjectTalents({
    attack: {
        gameId: t?.s1_id || 11231,
        title: 'talent_name.durin_flame_wing_strike',
        description: 'talent_descr.durin_flame_wing_strike',
        items: [
            { table: new StatTable('normal_hit_1', t?.s1?.p1 || []) },
            { table: new StatTable('normal_hit_2', t?.s1?.p2 || []) },
            { table: new StatTable('normal_hit_3', t?.s1?.p3 || []) },
            { table: new StatTable('normal_hit_4', t?.s1?.p4 || []) },
            { table: new StatTable('charged_hit', t?.s1?.p5 || []) },
            { unit: 'unit', table: new StatTable('stamina_cost', t?.s1?.p6 || []) },
            { table: new StatTable('plunge', t?.s1?.p7 || []) },
            { table: new StatTable('plunge_low', t?.s1?.p8 || []) },
            { table: new StatTable('plunge_high', t?.s1?.p9 || []) },
        ],
    },
    skill: {
        gameId: t?.s2_id || 11232,
        title: 'talent_name.durin_dualism',
        description: 'talent_descr.durin_dualism',
        items: [
            { table: new StatTable('durin_purity_dmg', t?.s2?.p1 || []) },
            { table: new StatTable('durin_darkness_dmg_1', t?.s2?.p2 || []) },
            { table: new StatTable('durin_darkness_dmg_2', t?.s2?.p3 || []) },
            { table: new StatTable('durin_darkness_dmg_3', t?.s2?.p4 || []) },
            { unit: '', table: new StatTable('durin_energy_restore', t?.s2?.p5 || []) },
            { unit: 'sec', table: new StatTable('cd', t?.s2?.p6 || []) },
        ],
    },
    burst: {
        gameId: t?.s3_id || 11235,
        title: 'talent_name.durin_purity_principle',
        description: 'talent_descr.durin_purity_principle',
        items: [
            { table: new StatTable('durin_purity_burst_1', t?.s3?.p1 || []) },
            { table: new StatTable('durin_purity_burst_2', t?.s3?.p2 || []) },
            { table: new StatTable('durin_purity_burst_3', t?.s3?.p3 || []) },
            { table: new StatTable('durin_darkness_burst_1', t?.s3?.p4 || []) },
            { table: new StatTable('durin_darkness_burst_2', t?.s3?.p5 || []) },
            { table: new StatTable('durin_white_dragon', t?.s3?.p6 || []) },
            { table: new StatTable('durin_black_dragon', t?.s3?.p7 || []) },
            { unit: 'sec', table: new StatTable('durin_dragon_duration', t?.s3?.p8 || []) },
            { unit: 'sec', table: new StatTable('cd', t?.s3?.p9 || []) },
            { unit: '', table: new StatTable('energy_cost', t?.s3?.p10 || []) },
        ],
    },
    links: [],
});

export const Durin = new DbObjectChar({
    name: 'durin',
    serializeId: 113,
    gameId: 10000123,
    iconClass: 'char-icon-durin',
    rarity: 5,
    element: 'pyro',
    weapon: 'sword',
    origin: 'mondstadt',
    coven: true,
    talents: Talents,
    statTable: charTables.Durin || [],
    features: [
        // Normal Attacks
        new FeatureDamageNormal({ name: 'normal_hit_1', element: 'pyro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_1') }),
        ]}),
        new FeatureDamageNormal({ name: 'normal_hit_2', element: 'pyro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_2') }),
        ]}),
        new FeatureDamageNormal({ name: 'normal_hit_3', element: 'pyro', hits: 2, multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_3') }),
        ]}),
        new FeatureDamageNormal({ name: 'normal_hit_4', element: 'pyro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_4') }),
        ]}),
        new FeatureDamageCharged({ name: 'charged_hit', element: 'pyro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.charged_hit') }),
        ]}),
        new FeatureDamagePlungeCollision({ name: 'plunge', element: 'pyro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.plunge') }),
        ]}),
        new FeatureDamagePlungeShockWave({ name: 'plunge_low', element: 'pyro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.plunge_low') }),
        ]}),
        new FeatureDamagePlungeShockWave({ name: 'plunge_high', element: 'pyro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.plunge_high') }),
        ]}),
        // Skill
        new FeatureDamageSkill({ name: 'durin_purity_dmg', element: 'pyro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_elemental', values: Talents.get('skill.durin_purity_dmg') }),
        ]}),
        new FeatureDamageSkill({ name: 'durin_darkness_dmg', element: 'pyro', hits: 3, multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_elemental', values: Talents.get('skill.durin_darkness_dmg_1') }),
            new FeatureMultiplier({ leveling: 'char_skill_elemental', values: Talents.get('skill.durin_darkness_dmg_2') }),
            new FeatureMultiplier({ leveling: 'char_skill_elemental', values: Talents.get('skill.durin_darkness_dmg_3') }),
        ]}),
        // Burst
        new FeatureDamageBurst({ name: 'durin_purity_burst', element: 'pyro', hits: 3, multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_burst', values: Talents.get('burst.durin_purity_burst_1') }),
            new FeatureMultiplier({ leveling: 'char_skill_burst', values: Talents.get('burst.durin_purity_burst_2') }),
            new FeatureMultiplier({ leveling: 'char_skill_burst', values: Talents.get('burst.durin_purity_burst_3') }),
        ]}),
        new FeatureDamageBurst({ name: 'durin_darkness_burst', element: 'pyro', hits: 3, multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_burst', values: Talents.get('burst.durin_darkness_burst_1') }),
            new FeatureMultiplier({ leveling: 'char_skill_burst', values: Talents.get('burst.durin_darkness_burst_2') }),
            new FeatureMultiplier({ leveling: 'char_skill_burst', values: Talents.get('burst.durin_purity_burst_3') }),
        ]}),
        new FeatureDamageBurst({ name: 'durin_white_dragon', element: 'pyro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_burst', values: Talents.get('burst.durin_white_dragon') }),
        ]}),
        new FeatureDamageBurst({ name: 'durin_black_dragon', element: 'pyro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_burst', values: Talents.get('burst.durin_black_dragon') }),
        ]}),
    ],
    conditions: [
        new ConditionStatic({
            title: 'talent_name.durin_divine_calculation',
            description: 'talent_descr.durin_divine_calculation',
            info: {ascension: 1},
            condition: new ConditionAscensionChar({ascension: 1}),
        }),
        new ConditionStatic({
            title: 'talent_name.durin_primordial_fusion',
            description: 'talent_descr.durin_primordial_fusion',
            info: {ascension: 4},
            condition: new ConditionAscensionChar({ascension: 4}),
        }),
    ],
    postEffects: [],
    constellation: new DbObjectConstellation([
        {conditions: [new ConditionStatic({title: 'talent_name.durin_c1', description: 'talent_descr.durin_c1'})]},
        {conditions: [new ConditionStatic({title: 'talent_name.durin_c2', description: 'talent_descr.durin_c2'})]},
        {conditions: [new Condition({settings: {char_skill_burst_bonus: 3}})]},
        {conditions: [new ConditionStatic({title: 'talent_name.durin_c4', description: 'talent_descr.durin_c4'})]},
        {conditions: [new Condition({settings: {char_skill_elemental_bonus: 3}})]},
        {conditions: [new ConditionStatic({title: 'talent_name.durin_c6', description: 'talent_descr.durin_c6'})]},
    ]),
});
