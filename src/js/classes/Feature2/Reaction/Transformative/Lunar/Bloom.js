import { BuildData } from "../../../../Build/Data";
import { FeatureReactionLunar } from "../Lunar";

/**
 * Lunar Bloom DMG - ignores DEF, does not consider ordinary DMG increase, but considers EM
 * BaseDMG = Property × Multiplier × (1 + BaseBonus%) × (1 + 6×EM/(EM+2000) + LunarBloomBonus%)
 * FinalDMG = (BaseDMG + ExtraDMG) × RES × CRIT
 * 
 * Moonsign - Nascent Radiance (1 Nod-Krai character):
 *   Lauma: Bloom/Burgeon/Hyperbloom can CRIT with fixed 15% CR, 100% CD
 * 
 * Moonsign - Supreme Radiance (2+ Nod-Krai characters):
 *   Lunar Bloom CRIT Rate +10%, CRIT DMG +20%
 */
export class FeatureReactionLunarBloom extends FeatureReactionLunar {
    constructor(params) {
        params.damageType ||= 'lunarbloom';
        super(params);
    }

    getReactionRate() { return 1 }
    getReactionPenalty() { return this.penalty }
    getScalingStat(data) { return 'lunarbloom_multi' }

    /**
     * @returns {Array.<string>}
     */
    getStatsReactionBonus() {
        let result = super.getStatsReactionBonus();
        result.push('dmg_reaction_lunarbloom');
        return result;
    }

    /**
     * @param {BuildData} data
     * @returns {Array.<string>}
     */
    getStatsCritRate(data) {
        let result = this.getDefaultStatsCritRate(data);
        result.push('crit_rate_lunarbloom');
        return result;
    }

    /**
     * @param {BuildData} data
     * @returns {Array.<string>}
     */
    getStatsCritDamage(data) {
        let result = this.getDefaultStatsCritDamage(data);
        result.push('crit_dmg_lunarbloom');
        return result;
    }
}
