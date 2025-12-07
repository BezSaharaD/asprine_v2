import { Condition } from "../../classes/Condition";
import { ConditionBoolean } from "../../classes/Condition/Boolean";
import { ConditionStatic } from "../../classes/Condition/Static";
import { DbObjectBuff } from "../../classes/DbObject/Buff";
import { ConditionMoonsign } from "../../classes/Condition/Moonsign";
import { ConditionCalcMoonsign } from "../../classes/Condition/CalcMoonsign";

// Moonsign levels:
// 0 - No Nod-Krai characters
// 1 - Nascent Radiance (1 Nod-Krai character)
// 2+ - Supreme Radiance (2+ Nod-Krai characters)

export const MoonsignResonance = new DbObjectBuff({
    name: 'moonsign_resonance',
    type: 'moonsign_resonance',
    conditions: [
        // Calculate moonsign level from party composition
        new ConditionCalcMoonsign({}),
        // Moonsign - Nascent Radiance (1 Nod-Krai character)
        new ConditionStatic({
            title: 'buffs_name.moonsign_nascent',
            description: 'buffs_descr.moonsign_nascent',
            stats: {
                crit_rate_bloom: 15,
                crit_dmg_bloom: 100,
            },
            hideCondition: [
                new ConditionMoonsign({
                    level: 1,
                    invert: true,
                }),
            ],
            subConditions: [
                new ConditionMoonsign({
                    level: 1,
                }),
            ],
        }),
        // Moonsign - Supreme Radiance (2+ Nod-Krai characters)
        new ConditionStatic({
            title: 'buffs_name.moonsign_supreme',
            description: 'buffs_descr.moonsign_supreme',
            stats: {
                crit_rate_bloom: 15,
                crit_dmg_bloom: 100,
                crit_rate_lunarbloom: 10,
                crit_dmg_lunarbloom: 20,
            },
            hideCondition: [
                new ConditionMoonsign({
                    level: 2,
                    invert: true,
                }),
            ],
            subConditions: [
                new ConditionMoonsign({
                    level: 2,
                }),
            ],
        }),
    ],
});
