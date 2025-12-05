import { Condition } from "../../classes/Condition";
import { ConditionAscensionChar } from "../../classes/Condition/Ascension/Char";
import { ConditionBoolean } from "../../classes/Condition/Boolean";

import { ConditionStatic } from "../../classes/Condition/Static";
import { DbObjectChar } from "../../classes/DbObject/Char";
import { DbObjectConstellation } from "../../classes/DbObject/Constellation";
import { DbObjectTalents } from "../../classes/DbObject/Talents";
import { FeatureDamageBurst } from "../../classes/Feature2/Damage/Burst";
import { FeatureDamageChargedAimed } from "../../classes/Feature2/Damage/Charged/Aimed";
import { FeatureDamageNormal } from "../../classes/Feature2/Damage/Normal";
import { FeatureDamagePlungeCollision } from "../../classes/Feature2/Damage/Plunge/Collision";
import { FeatureDamagePlungeShockWave } from "../../classes/Feature2/Damage/Plunge/ShockWave";
import { FeatureDamageSkill } from "../../classes/Feature2/Damage/Skill";
import { FeatureHeal } from "../../classes/Feature2/Heal";
import { FeatureMultiplier } from "../../classes/Feature2/Multiplier";
import { FeatureMultiplierList } from "../../classes/Feature2/Multiplier/List";
import { StatTable } from "../../classes/StatTable";
import { charTables } from "../generated/CharTables";
import { charTalentTables } from "../generated/CharTalentTables";

const Talents = new DbObjectTalents({
    attack: {
        gameId: charTalentTables.Yagoda.s1_id,
        title: 'talent_name.yagoda_shoot_hot',
        description: 'talent_descr.yagoda_shoot_hot',
        items: [
            { table: new StatTable('normal_hit_1', charTalentTables.Yagoda.s1.p1) },
            {
                type: 'multihit',
                hits: 2,
                table: new StatTable('normal_hit_2', charTalentTables.Yagoda.s1.p2),
            },
            { table: new StatTable('normal_hit_3', charTalentTables.Yagoda.s1.p3) },
            { table: new StatTable('aimed', charTalentTables.Yagoda.s1.p4) },
            { table: new StatTable('charged_aimed', charTalentTables.Yagoda.s1.p5) },
            { table: new StatTable('plunge', charTalentTables.Yagoda.s1.p6) },
            {
                type: 'separated',
                separator: ' / ',
                table: [
                    new StatTable('plunge_low', charTalentTables.Yagoda.s1.p7),
                    new StatTable('plunge_high', charTalentTables.Yagoda.s1.p8),
                ],
            },
        ],
    },
    skill: {
        gameId: charTalentTables.Yagoda.s2_id,
        title: 'talent_name.yagoda_cunning_plan',
        description: 'talent_descr.yagoda_cunning_plan',
        items: [
            { table: new StatTable('yagoda_smoke_bomb', charTalentTables.Yagoda.s2.p1) },
            { table: new StatTable('yagoda_partial_flask', charTalentTables.Yagoda.s2.p2) },
            { table: new StatTable('yagoda_full_flask', charTalentTables.Yagoda.s2.p3) },
            { table: new StatTable('yagoda_catball', charTalentTables.Yagoda.s2.p4) },
            { unit: 'sec', table: new StatTable('yagoda_flask_duration', charTalentTables.Yagoda.s2.p5) },
            { unit: 'sec', table: new StatTable('cd', charTalentTables.Yagoda.s2.p6) },
        ],
    },
    burst: {
        gameId: charTalentTables.Yagoda.s3_id,
        title: 'talent_name.yagoda_aces_sleeve',
        description: 'talent_descr.yagoda_aces_sleeve',
        items: [
            { table: new StatTable('yagoda_burst_dmg', charTalentTables.Yagoda.s3.p1) },
            { table: new StatTable('yagoda_coordinator_dmg', charTalentTables.Yagoda.s3.p2) },
            { unit: 'sec', table: new StatTable('yagoda_coordinator_duration', charTalentTables.Yagoda.s3.p7) },
            {
                type: 'shield',
                unit: 'atk',
                table: [
                    new StatTable('yagoda_coordinator_heal', charTalentTables.Yagoda.s3.p3),
                    new StatTable('', charTalentTables.Yagoda.s3.p4),
                ],
            },
            {
                type: 'shield',
                unit: 'atk',
                table: [
                    new StatTable('yagoda_extra_heal', charTalentTables.Yagoda.s3.p5),
                    new StatTable('', charTalentTables.Yagoda.s3.p6),
                ],
            },
            { unit: 'sec', table: new StatTable('cd', charTalentTables.Yagoda.s3.p8) },
            { unit: '', table: new StatTable('energy_cost', charTalentTables.Yagoda.s3.p9) },
        ],
    },
});

const TalentValues = {
    // A1 - Остроумный план истребования оплаты
    A1PyroBonus: 130,
    A1HydroBonus: 120,
    A1ElectroCount: 1,
    A1CryoInterval: 10,
    // A4 - Сладкая ягодная награда
    A4Mastery: 100,
    A4Duration: 6,
    A4HpThreshold: 70,
    // C1 - Ещё фляжку!
    C1BounceChance: 50,
    // C4 - Дикая ягода посреди пыли
    C4Energy: 4,
    // C6 - Крупица удачи
    C6CritRate: 5,
    C6CritDmg: 40,
    C6Duration: 20,
    // Skill energy restore
    SkillEnergyRestore: 2,
    SkillEnergyInterval: 3.5,
};


export const Yagoda = new DbObjectChar({
    name: 'yagoda',
    serializeId: 114,
    gameId: 10000124,
    iconClass: 'char-icon-yagoda',
    rarity: 4,
    element: 'anemo',
    weapon: 'bow',
    origin: 'nodkrai',
    talents: Talents,
    statTable: charTables.Yagoda,
    features: [
        new FeatureDamageNormal({
            name: 'normal_hit_1',
            multipliers: [
                new FeatureMultiplier({
                    leveling: 'char_skill_attack',
                    values: Talents.get('attack.normal_hit_1'),
                }),
            ],
        }),
        new FeatureDamageNormal({
            name: 'normal_hit_2',
            hits: 2,
            multipliers: [
                new FeatureMultiplier({
                    leveling: 'char_skill_attack',
                    values: Talents.get('attack.normal_hit_2'),
                }),
            ],
        }),
        new FeatureDamageNormal({
            name: 'normal_hit_3',
            multipliers: [
                new FeatureMultiplier({
                    leveling: 'char_skill_attack',
                    values: Talents.get('attack.normal_hit_3'),
                }),
            ],
        }),
        new FeatureDamageChargedAimed({
            name: 'aimed',
            multipliers: [
                new FeatureMultiplier({
                    leveling: 'char_skill_attack',
                    values: Talents.get('attack.aimed'),
                }),
            ],
        }),
        new FeatureDamageChargedAimed({
            name: 'charged_aimed',
            element: 'anemo',
            multipliers: [
                new FeatureMultiplier({
                    leveling: 'char_skill_attack',
                    values: Talents.get('attack.charged_aimed'),
                }),
            ],
        }),
        new FeatureDamagePlungeCollision({
            name: 'plunge',
            multipliers: [
                new FeatureMultiplier({
                    leveling: 'char_skill_attack',
                    values: Talents.get('attack.plunge'),
                }),
            ],
        }),
        new FeatureDamagePlungeShockWave({
            name: 'plunge_low',
            multipliers: [
                new FeatureMultiplier({
                    leveling: 'char_skill_attack',
                    values: Talents.get('attack.plunge_low'),
                }),
            ],
        }),
        new FeatureDamagePlungeShockWave({
            name: 'plunge_high',
            multipliers: [
                new FeatureMultiplier({
                    leveling: 'char_skill_attack',
                    values: Talents.get('attack.plunge_high'),
                }),
            ],
        }),
        new FeatureDamageSkill({
            name: 'yagoda_smoke_bomb',
            element: 'anemo',
            multipliers: [
                new FeatureMultiplier({
                    leveling: 'char_skill_elemental',
                    values: Talents.get('skill.yagoda_smoke_bomb'),
                }),
            ],
        }),
        new FeatureDamageSkill({
            name: 'yagoda_partial_flask',
            element: 'anemo',
            multipliers: [
                new FeatureMultiplier({
                    leveling: 'char_skill_elemental',
                    values: Talents.get('skill.yagoda_partial_flask'),
                }),
            ],
        }),
        new FeatureDamageSkill({
            name: 'yagoda_full_flask',
            element: 'anemo',
            multipliers: [
                new FeatureMultiplier({
                    leveling: 'char_skill_elemental',
                    values: Talents.get('skill.yagoda_full_flask'),
                }),
            ],
        }),
        new FeatureDamageSkill({
            name: 'yagoda_catball',
            element: 'anemo',
            multipliers: [
                new FeatureMultiplier({
                    leveling: 'char_skill_elemental',
                    values: Talents.get('skill.yagoda_catball'),
                }),
            ],
        }),
        new FeatureDamageBurst({
            name: 'yagoda_burst_dmg',
            element: 'anemo',
            multipliers: [
                new FeatureMultiplier({
                    leveling: 'char_skill_burst',
                    values: Talents.get('burst.yagoda_burst_dmg'),
                }),
            ],
        }),
        new FeatureDamageBurst({
            name: 'yagoda_coordinator_dmg',
            element: 'anemo',
            multipliers: [
                new FeatureMultiplier({
                    leveling: 'char_skill_burst',
                    values: Talents.get('burst.yagoda_coordinator_dmg'),
                }),
            ],
        }),
        new FeatureHeal({
            name: 'yagoda_coordinator_heal',
            category: 'burst',
            multipliers: [
                new FeatureMultiplierList({
                    scaling: 'atk*',
                    leveling: 'char_skill_burst',
                    values: Talents.getList('burst.yagoda_coordinator_heal'),
                }),
            ],
        }),
        new FeatureHeal({
            name: 'yagoda_extra_heal',
            category: 'burst',
            multipliers: [
                new FeatureMultiplierList({
                    scaling: 'atk*',
                    leveling: 'char_skill_burst',
                    values: Talents.getList('burst.yagoda_extra_heal'),
                }),
            ],
        }),
    ],
    conditions: [
        new ConditionStatic({
            title: 'talent_name.yagoda_moon_blessing',
            description: 'talent_descr.yagoda_moon_blessing',
        }),
        new ConditionStatic({
            title: 'talent_name.yagoda_payment_plan',
            description: 'talent_descr.yagoda_payment_plan',
            info: {ascension: 1},
            stats: {
                text_percent_pyro: TalentValues.A1PyroBonus,
                text_percent_hydro: TalentValues.A1HydroBonus,
                text_value_electro: TalentValues.A1ElectroCount,
                text_percent_cryo: TalentValues.A1CryoInterval,
            },
            condition: new ConditionAscensionChar({ascension: 1}),
        }),
        new ConditionBoolean({
            name: 'yagoda_sweet_reward',
            serializeId: 1,
            title: 'talent_name.yagoda_sweet_reward',
            description: 'talent_descr.yagoda_sweet_reward',
            info: {ascension: 4},
            stats: {
                mastery: TalentValues.A4Mastery,
                text_percent_hp: TalentValues.A4HpThreshold,
                text_value_mastery: TalentValues.A4Mastery,
                text_sec: TalentValues.A4Duration,
            },
            condition: new ConditionAscensionChar({ascension: 4}),
        }),
    ],
    constellation: new DbObjectConstellation([
        {
            conditions: [
                new ConditionStatic({
                    title: 'talent_name.yagoda_c1',
                    description: 'talent_descr.yagoda_c1',
                    stats: {
                        text_percent: TalentValues.C1BounceChance,
                    },
                }),
            ],
        },
        {
            conditions: [
                new ConditionStatic({
                    title: 'talent_name.yagoda_c2',
                    description: 'talent_descr.yagoda_c2',
                }),
            ],
        },
        {
            conditions: [
                new Condition({
                    settings: {
                        char_skill_burst_bonus: 3,
                    },
                }),
            ],
        },
        {
            conditions: [
                new ConditionStatic({
                    title: 'talent_name.yagoda_c4',
                    description: 'talent_descr.yagoda_c4',
                    stats: {
                        text_energy: TalentValues.C4Energy,
                    },
                }),
            ],
        },
        {
            conditions: [
                new Condition({
                    settings: {
                        char_skill_elemental_bonus: 3,
                    },
                }),
            ],
        },
        {
            conditions: [
                new ConditionBoolean({
                    name: 'yagoda_c6',
                    serializeId: 2,
                    title: 'talent_name.yagoda_c6',
                    description: 'talent_descr.yagoda_c6',
                    stats: {
                        crit_rate: TalentValues.C6CritRate,
                        crit_dmg: TalentValues.C6CritDmg,
                        text_sec: TalentValues.C6Duration,
                        text_crit_rate: TalentValues.C6CritRate,
                        text_crit_dmg: TalentValues.C6CritDmg,
                    },
                }),
            ],
        },
    ]),
    partyData: {
        conditions: [
            new ConditionBoolean({
                name: 'party.yagoda_sweet_reward',
                serializeId: 1,
                rotation: 'party',
                title: 'talent_name.yagoda_sweet_reward',
                description: 'talent_descr.yagoda_sweet_reward',
                info: {ascension: 4},
                stats: {
                    mastery: TalentValues.A4Mastery,
                    text_percent_hp: TalentValues.A4HpThreshold,
                    text_value_mastery: TalentValues.A4Mastery,
                    text_sec: TalentValues.A4Duration,
                },
            }),
            new ConditionBoolean({
                name: 'party.yagoda_c6',
                serializeId: 2,
                rotation: 'party',
                title: 'talent_name.yagoda_c6',
                description: 'talent_descr.yagoda_c6',
                info: {constellation: 6},
                stats: {
                    crit_rate: TalentValues.C6CritRate,
                    crit_dmg: TalentValues.C6CritDmg,
                    text_sec: TalentValues.C6Duration,
                    text_crit_rate: TalentValues.C6CritRate,
                    text_crit_dmg: TalentValues.C6CritDmg,
                },
            }),
        ],
    },
});
