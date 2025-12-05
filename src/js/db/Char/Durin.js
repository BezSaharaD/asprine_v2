import { Condition } from "../../classes/Condition";
import { ConditionAscensionChar } from "../../classes/Condition/Ascension/Char";
import { ConditionStatic } from "../../classes/Condition/Static";
import { DbObjectChar } from "../../classes/DbObject/Char";
import { DbObjectConstellation } from "../../classes/DbObject/Constellation";
import { DbObjectTalents } from "../../classes/DbObject/Talents";
import { charTables } from "../generated/CharTables";
import { charTalentTables } from "../generated/CharTalentTables";

const Talents = new DbObjectTalents({
    attack: {
        gameId: charTalentTables.Durin?.s1_id || 11231,
        title: 'talent_name.durin_flame_wing_strike',
        description: 'talent_descr.durin_flame_wing_strike',
        items: [],
    },
    skill: {
        gameId: charTalentTables.Durin?.s2_id || 11232,
        title: 'talent_name.durin_dualism',
        description: 'talent_descr.durin_dualism',
        items: [],
    },
    burst: {
        gameId: charTalentTables.Durin?.s3_id || 11235,
        title: 'talent_name.durin_purity_principle',
        description: 'talent_descr.durin_purity_principle',
        items: [],
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
    talents: Talents,
    statTable: charTables.Durin || [],
    features: [],
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
