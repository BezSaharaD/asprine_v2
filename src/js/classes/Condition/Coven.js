import { Condition } from "../Condition";

/**
 * Condition to check Coven (Witch's Sabbath) level based on Coven characters in party
 * Level 0: No Coven characters
 * Level 1: 1 Coven character
 * Level 2+: Secret Rite (2+ Coven characters)
 */
export class ConditionCoven extends Condition {
    getType() {
        return 'static';
    }

    isActive(settings) {
        let result = super.isActive(settings);
        if (!result) {
            return false;
        }

        const covenLevel = settings.coven_level || 0;
        const requiredLevel = this.params.level || 1;

        result = covenLevel >= requiredLevel;

        return this.params.invert ? !result : result;
    }
}
