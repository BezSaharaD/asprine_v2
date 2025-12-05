// Function cache for dynamically generated functions
const setFuncCache = new Map();
const concatFuncCache = new Map();

export class Stats {
    constructor(data) {
        if (data) {
            const keys = Object.keys(data);
            for (let i = 0; i < keys.length; i++) {
                this[keys[i]] = data[keys[i]];
            }
        }
    }

    add(stat, value) {
        this[stat] = (this[stat] || 0) + value;
    }

    set(stat, value) {
        this[stat] = value;
    }

    get(stat) {
        return this[stat] || 0;
    }

    del(stat) {
        delete this[stat];
    }

    isSet(stat) {
        return this.hasOwnProperty(stat);
    }

    getTotal(stat) {
        const base = this[stat + '_base'] || 0;
        let bonus = this[stat] || 0;
        const percent = this[stat + '_percent'] || 0;

        if (percent && base) {
            bonus += base * (percent / 100);
        }

        return base + bonus;
    }

    getTotalPercent(stat) {
        return (this[stat + '_base'] || 0) * (1 + (this[stat + '_percent'] || 0)) + (this[stat] || 0);
    }

    getBaseBonus(dmgType) {
        let result = this['base_dmg_bonus_' + dmgType] || 0;

        let bonus = this[dmgType + '_base_atk_percent'];
        if (bonus) {
            result += this.getTotal('atk') * bonus / 100;
        }

        bonus = this[dmgType + '_base_def_percent'];
        if (bonus) {
            result += this.getTotal('def') * bonus / 100;
        }

        bonus = this[dmgType + '_base_hp_percent'];
        if (bonus) {
            result += this.getTotal('hp') * bonus / 100;
        }

        bonus = this[dmgType + '_base_mastery_percent'];
        if (bonus) {
            result += this.getTotal('mastery') * bonus / 100;
        }

        return result;
    }

    isEmpty() {
        return Object.keys(this).length === 0;
    }

    concat(data) {
        const keys = Object.keys(data);
        for (let i = 0; i < keys.length; i++) {
            const stat = keys[i];
            this[stat] = (this[stat] || 0) + data[stat];
        }
    }

    // Clear all stats (for object reuse)
    clear() {
        const keys = Object.keys(this);
        for (let i = 0; i < keys.length; i++) {
            delete this[keys[i]];
        }
    }

    // Copy stats from another Stats object
    copyFrom(source) {
        this.clear();
        const keys = Object.keys(source);
        for (let i = 0; i < keys.length; i++) {
            this[keys[i]] = source[keys[i]];
        }
    }

    getSetFunc() {
        const keys = Object.keys(this).sort();
        const cacheKey = keys.join(',');
        
        let cached = setFuncCache.get(cacheKey);
        if (cached) {
            // Update values in cached function
            const values = keys.map(k => this[k]);
            return this._createSetFunc(keys, values);
        }

        const code = [];
        for (let i = 0; i < keys.length; i++) {
            code.push(`stats.${keys[i]} = ${this[keys[i]]}`);
        }
        const func = Function('stats', code.join(';'));
        setFuncCache.set(cacheKey, true);
        return func;
    }

    _createSetFunc(keys, values) {
        const code = [];
        for (let i = 0; i < keys.length; i++) {
            code.push(`stats.${keys[i]} = ${values[i]}`);
        }
        return Function('stats', code.join(';'));
    }

    getConcatFunc(setStats) {
        const keys = Object.keys(this);
        const code = [];
        
        for (let i = 0; i < keys.length; i++) {
            code.push(`stats.${keys[i]} += ${this[keys[i]]}`);
        }

        if (setStats) {
            const setKeys = Object.keys(setStats);
            for (let i = 0; i < setKeys.length; i++) {
                code.push(`stats.${setKeys[i]} = ${setStats[setKeys[i]]}`);
            }
        }

        return Function('stats', code.join(';'));
    }

    truncate(stats) {
        const keys = Object.keys(this);
        for (let i = 0; i < keys.length; i++) {
            if (!stats.includes(keys[i])) {
                delete this[keys[i]];
            }
        }
    }

    ensure(stats) {
        for (let i = 0; i < stats.length; i++) {
            if (!this[stats[i]]) {
                this[stats[i]] = 0;
            }
        }
    }

    processPercent() {
        const keys = Object.keys(this);
        for (let i = 0; i < keys.length; i++) {
            if (isPercent(keys[i])) {
                this[keys[i]] = this[keys[i]] / 100;
            }
        }
    }

    revertPercent() {
        const keys = Object.keys(this);
        for (let i = 0; i < keys.length; i++) {
            if (isPercent(keys[i])) {
                this[keys[i]] = this[keys[i]] * 100;
            }
        }
    }

    calcPost() {
        const totals = this.calcTotals();

        if (this.post_atk_hp_bonus) {
            const value = (this.post_atk_hp_bonus || 0) / 100;
            this.atk = (this.atk || 0) + (totals.hp_total || 0) * value;
        }
    }

    calcTotals(filterStat) {
        const result = new Stats();
        filterStat ||= '';

        const mainStats = ['atk', 'def', 'hp'];
        for (let i = 0; i < mainStats.length; i++) {
            const stat = mainStats[i];
            if (filterStat && filterStat !== stat) continue;

            const base = this[stat + '_base'] || 0;
            const bonus = (base * (this[stat + '_percent'] || 0) / 100) + (this[stat] || 0);
            const total = base + bonus;

            result[stat + '_base'] = base;
            result[stat + '_bonus'] = bonus;
            result[stat + '_total'] = total;
        }

        const secondaryStats = ['crit_rate', 'crit_dmg', 'mastery', 'healing', 'healing_recv', 'recharge', 'shield', 'recovery'];
        for (let i = 0; i < secondaryStats.length; i++) {
            const stat = secondaryStats[i];
            if (filterStat && filterStat !== stat) continue;

            const base = this[stat + '_base'] || 0;
            const bonus = this[stat] || 0;
            const total = base + bonus;

            result[stat + '_base'] = base;
            result[stat + '_bonus'] = bonus;
            result[stat + '_total'] = total;
        }

        const elements = ['anemo', 'geo', 'electro', 'pyro', 'cryo', 'hydro', 'phys'];
        const types = ['dmg_', 'res_'];
        for (let i = 0; i < elements.length; i++) {
            for (let j = 0; j < types.length; j++) {
                const stat = types[j] + elements[i];
                if (filterStat && filterStat !== stat) continue;

                const base = this[stat + '_base'] || 0;
                const bonus = this[stat] || 0;
                const total = base + bonus;

                result[stat + '_base'] = base;
                result[stat + '_bonus'] = bonus;
                result[stat + '_total'] = total;
            }
        }

        return result;
    }

    applyPostEffects(settings, effects, maxPriority) {
        if (!effects || !effects.length) return;

        const byPriority = {};

        for (let i = 0; i < effects.length; i++) {
            const item = effects[i];
            const priority = item.getPriority();

            if (maxPriority && priority > maxPriority) continue;

            if (!byPriority[priority]) {
                byPriority[priority] = [];
            }
            byPriority[priority].push(item);
        }

        const priorities = Object.keys(byPriority).sort((a, b) => a - b);
        for (let i = 0; i < priorities.length; i++) {
            const postStats = new Stats();
            const items = byPriority[priorities[i]];

            for (let j = 0; j < items.length; j++) {
                const postData = items[j].getData(this, settings);
                postStats.concat(postData);
            }

            this.concat(postStats);
        }
    }

    getFormatted(stat, opts) {
        return Stats.format(stat, this[stat] || 0, opts);
    }

    revert() {
        const result = new Stats();
        const keys = Object.keys(this);
        
        for (let i = 0; i < keys.length; i++) {
            result[keys[i]] = -1 * this[keys[i]];
        }

        return result;
    }

    static roundStatValue(stat, value, forcePercent) {
        const percent = forcePercent || isPercent(stat || '');
        value = parseFloat(value) + 0.00000001;
        if (percent) {
            return value.toFixed(1);
        }
        return Math.round(value);
    }

    static format(stat, value, opts) {
        opts ||= {};
        let result = value;
        const percent = isPercent(stat);

        if (Math.abs(value) < 0.00001) {
            return opts.zero ? '0' : '';
        }

        if (isDecimal(stat)) {
            result += 0.00000001;
            result = result.toFixed(opts.decimal_digits || 1);

            if (opts.no_decimal_zero) {
                result = result.replace(/(\.\d*?)0+$/, "$1").replace(/\.$/, "");
            }

            if (percent) {
                result = result + '%';
            }
        } else {
            result = Math.round(result);

            if (opts.minimize) {
                if (result > 10000000) {
                    result = (result / 1000000).toFixed(2) + 'm';
                } else if (result > 1000000) {
                    result = (result / 1000000).toFixed(3) + 'm';
                }
            }
        }

        result = result.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

        if (opts.signed) {
            if (value < 0) {
                if (result === '0') {
                    result = '-0';
                }
            } else {
                result = '+' + result;
            }
        }

        return result;
    }

    static diff(stats1, stats2) {
        const allStats = Object.assign({}, stats1, stats2);
        const result = new Stats();
        const keys = Object.keys(allStats);

        for (let i = 0; i < keys.length; i++) {
            const stat = keys[i];
            const value = (stats2[stat] || 0) - (stats1[stat] || 0);
            if (value) {
                result[stat] = value;
            }
        }

        return result;
    }
}

// Cached regex for performance
const percentRegex = /_percent/;
const percentPrefixRegex = /^(bond_of_life|stamina|recovery|duration|atk_speed|move_speed|healing|recharge|crit_|dmg_|enemy_|res_|.*bonus_|.*shield|.*_multi)/;
const decimalRegex = /(_cooldown|_decimal)/;

function isDecimal(stat) {
    if (isPercent(stat)) return true;
    return decimalRegex.test(stat);
}

export function isPercent(stat) {
    if (percentRegex.test(stat)) return true;
    return percentPrefixRegex.test(stat);
}
