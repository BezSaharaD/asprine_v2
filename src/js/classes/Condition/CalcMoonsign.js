import { Stats } from "../Stats";
import { Condition } from "../Condition";

/**
 * Calculates Moonsign level based on Nod-Krai characters in party
 * Level 0: No Nod-Krai characters
 * Level 1: Nascent Radiance (1 Nod-Krai character)
 * Level 2+: Supreme Radiance (2+ Nod-Krai characters)
 */
export class ConditionCalcMoonsign extends Condition {
    getData(settings) {
        let moonsignLevel = 0;

        if (this.isActive(settings) && settings) {
            // Check main character
            if (settings.char_id) {
                let mainChar = DB.Chars.getById(settings.char_id);
                if (mainChar && mainChar.getOrigin() === 'nodkrai') {
                    moonsignLevel++;
                }
            }

            // Check party characters
            for (const name of ['party_char_1', 'party_char_2', 'party_char_3']) {
                const char_id = settings[name] || '';
                if (!char_id) continue;

                let char = DB.Chars.getById(char_id);
                if (!char) continue;

                if (char.getOrigin() === 'nodkrai') {
                    moonsignLevel++;
                }
            }
        }

        return {
            settings: {
                moonsign_level: moonsignLevel,
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
