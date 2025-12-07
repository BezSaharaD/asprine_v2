import { Condition } from "../Condition";

/**
 * Condition to check Moonsign level based on Nod-Krai characters in party
 * Level 0: No Nod-Krai characters
 * Level 1: Nascent Radiance (1 Nod-Krai character)
 * Level 2+: Supreme Radiance (2+ Nod-Krai characters)
 */
export class ConditionMoonsign extends Condition {
    getType() {
        return 'static';
    }

    isActive(settings) {
        let result = super.isActive(settings);
        if (!result) {
            return false;
        }

        const moonsignLevel = settings.moonsign_level || 0;
        const requiredLevel = this.params.level || 1;

        result = moonsignLevel >= requiredLevel;

        return this.params.invert ? !result : result;
    }
}
