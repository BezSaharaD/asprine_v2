import { FeatureReactionLunar } from "../Lunar";

/**
 * Lunar Crystallize reaction (Hydro + Geo with Nod-Krai character)
 * Deals damage instead of creating shield like regular Crystallize
 */
export class FeatureReactionLunarCrystallize extends FeatureReactionLunar {
    // Direct Lunar Crystallize has multiplier 0.96 (vs 1.8 for Lunar Charged)
    getReactionRate() { return 0.96 }
    getReactionPenalty() { return this.penalty }
    getScalingStat(data) { return 'lunarcrystallize_multi' }

    /**
     * @returns {Array.<string>}
     */
    getStatsReactionBonus() {
        let result = super.getStatsReactionBonus();
        result.push('dmg_reaction_lunarcrystallize');
        return result;
    }

    /**
     * @returns {Array.<string>}
     */
    getStatsCritRate(data) {
        let result = this.getDefaultStatsCritRate(data);
        result.push('crit_rate_lunarcrystallize');
        return result;
    }

    /**
     * @returns {Array.<string>}
     */
    getStatsCritDamage(data) {
        let result = this.getDefaultStatsCritDamage(data);
        result.push('crit_dmg_lunarcrystallize');
        return result;
    }
}
