import { FeatureReactionLunar } from "../Lunar";

/**
 * Lunar-Charged reaction (Hydro + Electro with Nod-Krai character)
 * 
 * Key differences from Electro-Charged:
 * - Can CRIT (uses character's crit stats)
 * - Damage contribution from all party members:
 *   - Top 1: 100% damage
 *   - Top 2: 50% damage
 *   - Top 3-4: 1/12 damage each
 * - Thunder cloud lasts 6 seconds, strikes every 2 seconds
 * - Requires both Hydro AND Electro status on enemy simultaneously
 * - EM bonus: 6 × EM / (EM + 2000) (vs 16 × EM / (EM + 2000) for Electro-Charged)
 * - ~30-40% stronger than regular Electro-Charged
 */
export class FeatureReactionLunarCharged extends FeatureReactionLunar {
    getReactionRate() { return 1.8 }
    getReactionPenalty() { return this.penalty }
    getScalingStat(data) { return 'lunarcharged_multi' }

    /**
     * @returns {Array.<string>}
     */
    getStatsReactionBonus() {
        let result = super.getStatsReactionBonus();
        result.push('dmg_reaction_lunarcharged');
        return result;
    }

    /**
     * @returns {Array.<string>}
     */
    getStatsCritRate(data) {
        let result = this.getDefaultStatsCritRate(data);
        result.push('crit_rate_lunarcharged');
        return result;
    }

    /**
     * @returns {Array.<string>}
     */
    getStatsCritDamage(data) {
        let result = this.getDefaultStatsCritDamage(data);
        result.push('crit_dmg_lunarcharged');
        return result;
    }
}
