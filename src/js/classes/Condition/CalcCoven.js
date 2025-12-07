import { Stats } from "../Stats";
import { Condition } from "../Condition";

/**
 * Calculates Coven (Witch's Sabbath) level based on Coven characters in party
 * Level 0: No Coven characters
 * Level 1: 1 Coven character
 * Level 2+: Secret Rite (2+ Coven characters) - enhances Coven character abilities
 */
export class ConditionCalcCoven extends Condition {
    getData(settings) {
        let covenLevel = 0;

        if (this.isActive(settings) && settings) {
            // Check main character
            if (settings.char_id) {
                let mainChar = DB.Chars.getById(settings.char_id);
                if (mainChar && mainChar.isCoven && mainChar.isCoven()) {
                    covenLevel++;
                }
            }

            // Check party characters
            for (const name of ['party_char_1', 'party_char_2', 'party_char_3']) {
                const char_id = settings[name] || '';
                if (!char_id) continue;

                let char = DB.Chars.getById(char_id);
                if (!char) continue;

                if (char.isCoven && char.isCoven()) {
                    covenLevel++;
                }
            }
        }

        return {
            settings: {
                coven_level: covenLevel,
            },
            stats: new Stats(),
        };
    }

    getAllConditionsOn(settings) {
        return this.getData(settings || {}).settings;
    }

    getStats(settings) {
        return new Stats();
    }
}
