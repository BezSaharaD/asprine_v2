import { ConditionStatic } from "../../classes/Condition/Static";
import { DbObjectBuff } from "../../classes/DbObject/Buff";
import { ConditionCoven } from "../../classes/Condition/Coven";
import { ConditionCalcCoven } from "../../classes/Condition/CalcCoven";

// Coven (Witch's Sabbath) levels:
// 0 - No Coven characters
// 1 - 1 Coven character
// 2+ - Secret Rite (2+ Coven characters) - enhances Coven character abilities by 75%

export const CovenResonance = new DbObjectBuff({
    name: 'coven_resonance',
    type: 'coven_resonance',
    conditions: [
        // Calculate coven level from party composition
        new ConditionCalcCoven({}),
        // Coven - Secret Rite (2+ Coven characters)
        new ConditionStatic({
            title: 'buffs_name.coven_secret_rite',
            description: 'buffs_descr.coven_secret_rite',
            stats: {
                text_percent: 75,
            },
            hideCondition: [
                new ConditionCoven({
                    level: 2,
                    invert: true,
                }),
            ],
            subConditions: [
                new ConditionCoven({
                    level: 2,
                }),
            ],
        }),
    ],
});
