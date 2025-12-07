import { Condition } from "../../classes/Condition";
import { ConditionAscensionChar } from "../../classes/Condition/Ascension/Char";
import { ConditionBoolean } from "../../classes/Condition/Boolean";
import { ConditionNumber } from "../../classes/Condition/Number";
import { ConditionStatic } from "../../classes/Condition/Static";
import { DbObjectChar } from "../../classes/DbObject/Char";
import { DbObjectConstellation } from "../../classes/DbObject/Constellation";
import { DbObjectTalents } from "../../classes/DbObject/Talents";
import { FeatureDamageCharged } from "../../classes/Feature2/Damage/Charged";
import { FeatureDamageNormal } from "../../classes/Feature2/Damage/Normal";
import { FeatureDamagePlungeCollision } from "../../classes/Feature2/Damage/Plunge/Collision";
import { FeatureDamagePlungeShockWave } from "../../classes/Feature2/Damage/Plunge/ShockWave";
import { FeatureDamageSkill } from "../../classes/Feature2/Damage/Skill";
import { FeatureMultiplier } from "../../classes/Feature2/Multiplier";
import { FeaturePostEffectValue } from "../../classes/Feature2/PostEffectValue";
import { PostEffectStats } from "../../classes/PostEffect/Stats";
import { PostEffectStatsAtk } from "../../classes/PostEffect/Stats/Atk";
import { StatTable } from "../../classes/StatTable";
import { ValueTable } from "../../classes/ValueTable";
import { charTables } from "../generated/CharTables";
import { charTalentTables } from "../generated/CharTalentTables";

const t = charTalentTables.Lauma;

// Moonsign - Nascent Radiance: Fixed CRIT for Bloom/Burgeon/Hyperbloom
const MoonsignNascentCritRate = 15;
const MoonsignNascentCritDmg = 100;

// Moonsign - Supreme Radiance: Additional CRIT for Lunar Bloom (2+ Nod-Krai characters)
const MoonsignSupremeCritRate = 10;
const MoonsignSupremeCritDmg = 20;

// Lunar Resonance bonuses from non-Nod-Krai characters (max 36% total)
// Hydro: +0.6% Lunar reaction DMG per 1000 Max HP
// Electro: +0.3% Lunar reaction DMG per 100 ATK
// Pyro/Cryo: +0.6% Lunar reaction DMG per 100 EM
// Anemo/Dendro: +0.6% Lunar reaction DMG per 100 EM
// Geo: +0.6% Lunar reaction DMG per 100 DEF
const LunarResonanceHydroScale = 0.6; // per 1000 HP
const LunarResonanceElectroScale = 0.3; // per 100 ATK
const LunarResonanceEmScale = 0.6; // per 100 EM (Pyro/Cryo/Anemo/Dendro)
const LunarResonanceGeoScale = 0.6; // per 100 DEF
const LunarResonanceMaxBonus = 36;

const Talents = new DbObjectTalents({
    attack: {
        gameId: t?.s1_id || 11191,
        title: 'talent_name.lauma_linnunrata',
        description: 'talent_descr.lauma_linnunrata',
        items: [
            { table: new StatTable('normal_hit_1', t?.s1?.p1 || []) },
            { table: new StatTable('normal_hit_2', t?.s1?.p2 || []) },
            { table: new StatTable('normal_hit_3', t?.s1?.p3 || []) },
            { unit: 'unit', table: new StatTable('spirit_stamina', t?.s1?.p4 || []) },
            { unit: 'unit', table: new StatTable('spirit_jump_stamina', t?.s1?.p5 || []) },
            { unit: 'sec', table: new StatTable('spirit_duration', t?.s1?.p6 || []) },
            { unit: 'sec', table: new StatTable('spirit_cd', t?.s1?.p7 || []) },
            { unit: 'unit', table: new StatTable('invocation_stamina', t?.s1?.p8 || []) },
            { table: new StatTable('charged_hit', t?.s1?.p9 || []) },
            { table: new StatTable('plunge', t?.s1?.p10 || []) },
            { table: new StatTable('plunge_low', t?.s1?.p11 || []) },
            { table: new StatTable('plunge_high', t?.s1?.p12 || []) },
        ],
    },
    skill: {
        gameId: t?.s2_id || 11192,
        title: 'talent_name.lauma_rune_song_karssiko',
        description: 'talent_descr.lauma_rune_song_karssiko',
        items: [
            { table: new StatTable('lauma_tap_dmg', t?.s2?.p1 || []) },
            { table: new StatTable('lauma_hold_dmg_1', t?.s2?.p2 || []) },
            { table: new StatTable('lauma_hold_dmg_2', t?.s2?.p3 || []) },
            { table: new StatTable('lauma_shrine_dmg_atk', t?.s2?.p4 || []) },
            { table: new StatTable('lauma_shrine_dmg_em', t?.s2?.p5 || []) },
            { unit: 'sec', table: new StatTable('lauma_shrine_duration', t?.s2?.p6 || []) },
            { unit: 'sec', table: new StatTable('lauma_moon_song_duration', t?.s2?.p7 || []) },
            { table: new StatTable('lauma_res_reduction', t?.s2?.p8 || []) },
            { unit: 'sec', table: new StatTable('lauma_res_duration', t?.s2?.p9 || []) },
            { unit: 'sec', table: new StatTable('cd', t?.s2?.p10 || []) },
        ],
    },
    burst: {
        gameId: t?.s3_id || 11195,
        title: 'talent_name.lauma_rune_song_moon',
        description: 'talent_descr.lauma_rune_song_moon',
        items: [
            { unit: '', table: new StatTable('lauma_ashen_hymn', t?.s3?.p1 || []) },
            { unit: '', table: new StatTable('lauma_moon_conversion', t?.s3?.p2 || []) },
            { table: new StatTable('lauma_bloom_bonus', t?.s3?.p3 || []) },
            { table: new StatTable('lauma_lunar_bloom_bonus', t?.s3?.p4 || []) },
            { unit: 'sec', table: new StatTable('lauma_ashen_duration', t?.s3?.p5 || []) },
            { unit: 'sec', table: new StatTable('cd', t?.s3?.p6 || []) },
            { unit: '', table: new StatTable('energy_cost', t?.s3?.p7 || []) },
        ],
    },
    links: [],
});

const PassiveLunarBloomScale = 0.0175;
const PassiveLunarBloomScaleCap = 14;

const lunarBloomPost = new PostEffectStatsAtk({
    percent: new StatTable('lunarbloom_multi', [PassiveLunarBloomScale / 100]),
    statCap: new ValueTable([PassiveLunarBloomScaleCap]),
});

// Moonsign - Nascent Radiance: Bloom/Burgeon/Hyperbloom can CRIT (fixed 15% CR, 100% CD)
const moonsignNascentPost = new PostEffectStats({
    stats: {
        crit_rate_bloom: MoonsignNascentCritRate,
        crit_dmg_bloom: MoonsignNascentCritDmg,
        crit_rate_burning: MoonsignNascentCritRate,
        crit_dmg_burning: MoonsignNascentCritDmg,
    },
});

// Moonsign - Supreme Radiance: Lunar Bloom CRIT +10% CR, +20% CD (2+ Nod-Krai characters)
const moonsignSupremePost = new PostEffectStats({
    stats: {
        crit_rate_lunarbloom: MoonsignSupremeCritRate,
        crit_dmg_lunarbloom: MoonsignSupremeCritDmg,
    },
    condition: new ConditionBoolean({name: 'lauma_moonsign_supreme'}),
});

export const Lauma = new DbObjectChar({
    name: 'lauma',
    serializeId: 111,
    gameId: 10000119,
    iconClass: 'char-icon-lauma',
    rarity: 5,
    element: 'dendro',
    weapon: 'catalyst',
    origin: 'nodkrai',
    talents: Talents,
    statTable: charTables.Lauma || [],
    features: [
        // Normal Attacks
        new FeatureDamageNormal({ name: 'normal_hit_1', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_1') }),
        ]}),
        new FeatureDamageNormal({ name: 'normal_hit_2', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_2') }),
        ]}),
        new FeatureDamageNormal({ name: 'normal_hit_3', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.normal_hit_3') }),
        ]}),
        new FeatureDamageCharged({ name: 'charged_hit', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.charged_hit') }),
        ]}),
        new FeatureDamagePlungeCollision({ name: 'plunge', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.plunge') }),
        ]}),
        new FeatureDamagePlungeShockWave({ name: 'plunge_low', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.plunge_low') }),
        ]}),
        new FeatureDamagePlungeShockWave({ name: 'plunge_high', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_attack', values: Talents.get('attack.plunge_high') }),
        ]}),
        // Skill
        new FeatureDamageSkill({ name: 'lauma_tap_dmg', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_elemental', values: Talents.get('skill.lauma_tap_dmg') }),
        ]}),
        new FeatureDamageSkill({ name: 'lauma_hold_dmg_1', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_elemental', values: Talents.get('skill.lauma_hold_dmg_1') }),
        ]}),
        new FeatureDamageSkill({ name: 'lauma_shrine_dmg', element: 'dendro', multipliers: [
            new FeatureMultiplier({ leveling: 'char_skill_elemental', values: Talents.get('skill.lauma_shrine_dmg_atk') }),
            new FeatureMultiplier({ scaling: 'mastery*', leveling: 'char_skill_elemental', values: Talents.get('skill.lauma_shrine_dmg_em') }),
        ]}),
        new FeaturePostEffectValue({
            category: 'other',
            name: 'lauma_lunar_bloom_base',
            postEffect: lunarBloomPost,
            format: 'percent',
        }),
    ],
    conditions: [
        new Condition({ settings: { allowed_lunarbloom: 1 } }),
        new ConditionStatic({
            title: 'talent_name.lauma_moon_blessing',
            description: 'talent_descr.lauma_moon_blessing',
            stats: { text_percent: PassiveLunarBloomScale, text_percent_max: PassiveLunarBloomScaleCap },
        }),
        // Moonsign - Nascent Radiance: Bloom/Burgeon/Hyperbloom can CRIT
        new ConditionStatic({
            title: 'talent_name.lauma_moonsign_nascent',
            description: 'talent_descr.lauma_moonsign_nascent',
            stats: { 
                crit_rate_bloom: MoonsignNascentCritRate, 
                crit_dmg_bloom: MoonsignNascentCritDmg,
            },
        }),
        // Moonsign - Supreme Radiance: Additional CRIT for Lunar Bloom (2+ Nod-Krai)
        new ConditionBoolean({
            name: 'lauma_moonsign_supreme',
            serializeId: 1,
            title: 'talent_name.lauma_moonsign_supreme',
            description: 'talent_descr.lauma_moonsign_supreme',
            stats: { 
                crit_rate_lunarbloom: MoonsignSupremeCritRate, 
                crit_dmg_lunarbloom: MoonsignSupremeCritDmg,
            },
        }),
        new ConditionStatic({
            title: 'talent_name.lauma_spring_ablution',
            description: 'talent_descr.lauma_spring_ablution',
            info: {ascension: 4},
            condition: new ConditionAscensionChar({ascension: 4}),
        }),
        // Lunar Resonance: Bonus from non-Nod-Krai Hydro characters (0.6% per 1000 HP, max 36%)
        new ConditionNumber({
            name: 'lauma_lunar_resonance_hydro',
            serializeId: 2,
            title: 'talent_name.lauma_lunar_resonance_hydro',
            description: 'talent_descr.lauma_lunar_resonance_hydro',
            max: LunarResonanceMaxBonus,
            stats: {
                dmg_reaction_lunarcharged: 1,
                dmg_reaction_lunarbloom: 1,
                dmg_reaction_lunarcrystallize: 1,
            },
        }),
    ],
    postEffects: [lunarBloomPost, moonsignNascentPost, moonsignSupremePost],
    constellation: new DbObjectConstellation([
        {conditions: [new ConditionStatic({title: 'talent_name.lauma_c1', description: 'talent_descr.lauma_c1'})]},
        {conditions: [new ConditionStatic({title: 'talent_name.lauma_c2', description: 'talent_descr.lauma_c2'})]},
        {conditions: [new Condition({settings: {char_skill_burst_bonus: 3}})]},
        {conditions: [new ConditionStatic({title: 'talent_name.lauma_c4', description: 'talent_descr.lauma_c4'})]},
        {conditions: [new Condition({settings: {char_skill_elemental_bonus: 3}})]},
        {conditions: [new ConditionStatic({title: 'talent_name.lauma_c6', description: 'talent_descr.lauma_c6'})]},
    ]),
});
