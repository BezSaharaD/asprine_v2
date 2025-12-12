import { ArtifactSet } from "../../../classes/ArtifactSet";
import { ConditionBoolean } from "../../../classes/Condition/Boolean";
import { ConditionStatic } from "../../../classes/Condition/Static";

export const NightOfTheSkysUnveiling = new ArtifactSet({
    serializeId: 56,
    goodId: 'NightOfTheSkysUnveiling',
    gameId: 15041,
    itemIds: [],
    name: "artifact_set.night_of_the_skys_unveiling",
    iconClass: "artifact-icon-night-of-the-skys-unveiling",
    minRarity: 4,
    maxRarity: 5,
    setBonus: [
        {},
        {
            conditions: [
                new ConditionStatic({
                    title: 'set_bonus.night_of_the_skys_unveiling_2',
                    description: 'set_descr.night_of_the_skys_unveiling_2',
                    stats: {
                        mastery: 80,
                    },
                })
            ],
        },
        {},
        {
            conditions: [
                new ConditionStatic({
                    title: 'set_bonus.night_of_the_skys_unveiling_4',
                    description: 'set_descr.night_of_the_skys_unveiling_4',
                    stats: {
                        text_percent: 15,
                        text_percent_2: 30,
                        text_percent_3: 10,
                    },
                }),
                new ConditionBoolean({
                    name: 'set.night_of_the_skys_unveiling_4_nascent',
                    serializeId: 48,
                    title: 'set_bonus.night_of_the_skys_unveiling_4_nascent',
                    stats: {
                        crit_rate: 15,
                    },
                }),
                new ConditionBoolean({
                    name: 'set.night_of_the_skys_unveiling_4_ascendant',
                    serializeId: 49,
                    title: 'set_bonus.night_of_the_skys_unveiling_4_ascendant',
                    stats: {
                        crit_rate: 30,
                    },
                }),
            ],
        },
    ],
})
