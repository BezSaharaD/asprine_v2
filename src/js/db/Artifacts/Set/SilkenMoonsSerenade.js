import { ArtifactSet } from "../../../classes/ArtifactSet";
import { ConditionBoolean } from "../../../classes/Condition/Boolean";
import { ConditionStatic } from "../../../classes/Condition/Static";

export const SilkenMoonsSerenade = new ArtifactSet({
    serializeId: 57,
    goodId: 'SilkenMoonsSerenade',
    gameId: 15042,
    itemIds: [],
    name: "artifact_set.silken_moons_serenade",
    iconClass: "artifact-icon-silken-moons-serenade",
    minRarity: 4,
    maxRarity: 5,
    setBonus: [
        {},
        {
            conditions: [
                new ConditionStatic({
                    title: 'set_bonus.silken_moons_serenade_2',
                    description: 'set_descr.silken_moons_serenade_2',
                    stats: {
                        recharge: 20,
                    },
                })
            ],
        },
        {},
        {
            conditions: [
                new ConditionStatic({
                    title: 'set_bonus.silken_moons_serenade_4',
                    description: 'set_descr.silken_moons_serenade_4',
                    stats: {
                        text_value: 60,
                        text_value_2: 120,
                        text_percent: 10,
                    },
                }),
                new ConditionBoolean({
                    name: 'set.silken_moons_serenade_4_nascent',
                    serializeId: 50,
                    title: 'set_bonus.silken_moons_serenade_4_nascent',
                    stats: {
                        mastery_party: 60,
                    },
                }),
                new ConditionBoolean({
                    name: 'set.silken_moons_serenade_4_ascendant',
                    serializeId: 51,
                    title: 'set_bonus.silken_moons_serenade_4_ascendant',
                    stats: {
                        mastery_party: 120,
                    },
                }),
            ],
        },
    ],
})
