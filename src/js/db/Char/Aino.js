import { Condition } from "../../classes/Condition";
import { ConditionAscensionChar } from "../../classes/Condition/Ascension/Char";
import { ConditionBoolean } from "../../classes/Condition/Boolean";
import { ConditionConstellation } from "../../classes/Condition/Constellation";
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

const Talents = new DbObjectTalents({
    attack: {
        gameId: charTalentTables.Aino?.s1_id || 11211,
        title: 'talent_name.aino_repair_method',
        description: 'talent_descr.aino_repair_method',
        items: [],
    },
    skill: {
        gameId: charTalentTables.Aino?.s2_id || 11212,
        title: 'talent_name.aino_inspiration_catcher',
        description: 'talent_descr.aino_inspiration_catcher',
        items: [],
    },
    burst: {
        gameId: charTalentTables.Aino?.s3_id || 11215,
        title: 'talent_name.aino_precision_cooler',
        description: 'talent_descr.aino_precision_cooler',
        items: [],
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
    features: [],
    conditions: [
        new Condition({
            settings: {
                allowed_lunarcharged: 1,
            },
        }),
        new ConditionStatic({
            title: 'talent_name.aino_moon_blessing',
            description: 'talent_descr.aino_moon_blessing',
        }),
        new ConditionStatic({
            title: 'talent_name.aino_structured_amplifier',
            description: 'talent_descr.aino_structured_amplifier',
            info: {ascension: 4},
            stats: {
                text_percent: A4EmScale,
            },
            condition: new ConditionAscensionChar({ascension: 4}),
        }),
    ],
    postEffects: [],
    constellation: new DbObjectConstellation([
        {
            conditions: [
                new ConditionStatic({
                    title: 'talent_name.aino_c1',
                    description: 'talent_descr.aino_c1',
                }),
            ],
        },
        {
            conditions: [
                new ConditionStatic({
                    title: 'talent_name.aino_c2',
                    description: 'talent_descr.aino_c2',
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
                    title: 'talent_name.aino_c4',
                    description: 'talent_descr.aino_c4',
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
                new ConditionStatic({
                    title: 'talent_name.aino_c6',
                    description: 'talent_descr.aino_c6',
                }),
            ],
        },
    ]),
});
