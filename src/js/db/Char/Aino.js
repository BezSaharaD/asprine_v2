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

const t = charTalentTables.Aino;

const Talents = new DbObjectTalents({
    attack: {
        gameId: t?.s1_id || 11211,
        title: 'talent_name.aino_repair_method',
        description: 'talent_descr.aino_repair_method',
        items: [
            { table: new StatTable('normal_hit_1', t?.s1?.p1 || []) },
            { table: new StatTable('normal_hit_2', t?.s1?.p2 || []) },
            { table: new StatTable('normal_hit_3', t?.s1?.p3 || []) },
            { table: new StatTable('charged_spinning', t?.s1?.p4 || []) },
            { table: new StatTable('charged_final', t?.s1?.p5 || []) },
            { unit: 'unit', table: new StatTable('stamina_cost', t?.s1?.p6 || []) },
            { unit: 'sec', table: new StatTable('max_duration', t?.s1?.p7 || []) },
            { table: new StatTable('plunge', t?.s1?.p8 || []) },
            { table: new StatTable('plunge_low', t?.s1?.p9 || []) },
            { table: new StatTable('plunge_high', t?.s1?.p10 || []) },
        ],
    },
    skill: {
        gameId: t?.s2_id || 11212,
        title: 'talent_name.aino_inspiration_catcher',
        description: 'talent_descr.aino_inspiration_catcher',
        items: [
            { table: new StatTable('aino_skill_dmg_1', t?.s2?.p1 || []) },
            { table: new StatTable('aino_skill_dmg_2', t?.s2?.p2 || []) },
            { unit: 'sec', table: new StatTable('cd', t?.s2?.p3 || []) },
        ],
    },
    burst: {
        gameId: t?.s3_id || 11215,
        title: 'talent_name.aino_precision_cooler',
        description: 'talent_descr.aino_precision_cooler',
        items: [
            { table: new StatTable('aino_water_projectile', t?.s3?.p1 || []) },
            { unit: 'sec', table: new StatTable('aino_burst_duration', t?.s3?.p2 || []) },
            { unit: 'sec', table: new StatTable('cd', t?.s3?.p3 || []) },
            { unit: '', table: new StatTable('energy_cost', t?.s3?.p4 || []) },
        ],
    },
    links: [],
});

const A4EmScale = 50;

export const Aino = new DbObjectChar({
    name: 'aino',
    serializeId: 109,
    gameId: 10000121,
    iconClass: 'char-icon-aino',
    rarity: 4,
    element: 'hydro',
    weapon: 'claymore',
    origin: 'nodkrai',
    talents: Talents,
    statTable: charTables.Aino || [],
    features: [
        // Normal Attacks
        new FeatureDamageNormal({ name: 'normal_hit_1', element: 'hydro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_1') }),
        ]}),
        new FeatureDamageNormal({ name: 'normal_hit_2', element: 'hydro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_2') }),
        ]}),
        new FeatureDamageNormal({ name: 'normal_hit_3', element: 'hydro', hits: 2, multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_3') }),
        ]}),
        new FeatureDamageCharged({ name: 'charged_spinning', element: 'hydro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.charged_spinning') }),
        ]}),
        new FeatureDamageCharged({ name: 'charged_final', element: 'hydro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.charged_final') }),
        ]}),
        new FeatureDamagePlungeCollision({ name: 'plunge', element: 'hydro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.plunge') }),
        ]}),
        new FeatureDamagePlungeShockWave({ name: 'plunge_low', element: 'hydro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.plunge_low') }),
        ]}),
        new FeatureDamagePlungeShockWave({ name: 'plunge_high', element: 'hydro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.plunge_high') }),
        ]}),
        // Skill
        new FeatureDamageSkill({ name: 'aino_skill_dmg_1', element: 'hydro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_elemental', values: Talents.get('skill.aino_skill_dmg_1') }),
        ]}),
        new FeatureDamageSkill({ name: 'aino_skill_dmg_2', element: 'hydro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_elemental', values: Talents.get('skill.aino_skill_dmg_2') }),
        ]}),
        // Burst
        new FeatureDamageBurst({ name: 'aino_water_projectile', element: 'hydro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_burst', values: Talents.get('burst.aino_water_projectile') }),
        ]}),
    ],
    conditions: [
        new Condition({ settings: { allowed_lunarcharged: 1 } }),
        new ConditionStatic({
            title: 'talent_name.aino_moon_blessing',
            description: 'talent_descr.aino_moon_blessing',
        }),
        new ConditionStatic({
            title: 'talent_name.aino_structured_amplifier',
            description: 'talent_descr.aino_structured_amplifier',
            info: {ascension: 4},
            stats: { text_percent: A4EmScale },
            condition: new ConditionAscensionChar({ascension: 4}),
        }),
    ],
    postEffects: [],
    constellation: new DbObjectConstellation([
        {conditions: [new ConditionStatic({title: 'talent_name.aino_c1', description: 'talent_descr.aino_c1'})]},
        {conditions: [new ConditionStatic({title: 'talent_name.aino_c2', description: 'talent_descr.aino_c2'})]},
        {conditions: [new Condition({settings: {char_skill_burst_bonus: 3}})]},
        {conditions: [new ConditionStatic({title: 'talent_name.aino_c4', description: 'talent_descr.aino_c4'})]},
        {conditions: [new Condition({settings: {char_skill_elemental_bonus: 3}})]},
        {conditions: [new ConditionStatic({title: 'talent_name.aino_c6', description: 'talent_descr.aino_c6'})]},
    ]),
});
