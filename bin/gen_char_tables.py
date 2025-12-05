#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Генератор CharTables и CharTalentTables из txt файлов персонажей
"""

import re
import os

# Маппинг персонажей
CHARS = {
    'нефер': {'name': 'Nefer', 'rarity': 5, 'bonus_stat': 'crit_dmg'},
    'лаума': {'name': 'Lauma', 'rarity': 5, 'bonus_stat': 'mastery'},
    'флинс': {'name': 'Flinss', 'rarity': 5, 'bonus_stat': 'crit_dmg'},
    'дурин': {'name': 'Durin', 'rarity': 5, 'bonus_stat': 'crit_dmg'},
    'айно': {'name': 'Aino', 'rarity': 4, 'bonus_stat': 'mastery'},
    'ягода': {'name': 'Yagoda', 'rarity': 4, 'bonus_stat': 'heal_bonus'},
}

def parse_stats_line(line):
    """Парсит строку со статами"""
    parts = line.split('\t')
    if len(parts) < 6:
        return None
    try:
        lv = parts[0].replace('+', '')
        hp = float(parts[1])
        atk = float(parts[2])
        defense = float(parts[3])
        return {'lv': lv, 'hp': hp, 'atk': atk, 'def': defense}
    except:
        return None

def parse_char_file(filepath):
    """Парсит файл персонажа"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    stats = []
    lines = content.split('\n')
    in_stats = False
    
    for line in lines:
        if 'Lv\tHP\tAtk\tDef' in line:
            in_stats = True
            continue
        if in_stats:
            if line.startswith('Skills') or line.startswith('Active'):
                break
            parsed = parse_stats_line(line)
            if parsed:
                stats.append(parsed)
    
    return stats

def generate_char_table(name, stats, rarity, bonus_stat):
    """Генерирует CharTable для персонажа"""
    if not stats:
        return ""
    
    # Базовые статы (уровень 1)
    base = stats[0]
    
    # Статы возвышения (20+, 40+, 50+, 60+, 70+, 80+)
    asc_stats = [s for s in stats if '+' in str(s.get('lv', ''))]
    
    scale = 's5hp' if rarity == 5 else 's4hp'
    atk_scale = 's5atk' if rarity == 5 else 's4atk'
    
    # Вычисляем ascension значения
    hp_asc = [s['hp'] - base['hp'] for s in asc_stats[:6]] if len(asc_stats) >= 6 else []
    atk_asc = [s['atk'] - base['atk'] for s in asc_stats[:6]] if len(asc_stats) >= 6 else []
    def_asc = [s['def'] - base['def'] for s in asc_stats[:6]] if len(asc_stats) >= 6 else []
    
    return f'''    {name}: [
        new StatTableAscensionScale({{
            stat: 'atk_base',
            base: {base['atk']},
            ascension: new StatTable('', {atk_asc}),
            scale: charScales.{atk_scale},
        }}),
        new StatTableAscensionScale({{
            stat: 'burst_energy_cost',
            base: 60,
        }}),
        new StatTableAscensionScale({{
            stat: 'charged_stamina_cost',
            base: 50,
        }}),
        new StatTableAscensionScale({{
            stat: 'crit_dmg_base',
            base: 50,
        }}),
        new StatTableAscensionScale({{
            stat: 'crit_rate_base',
            base: 5,
        }}),
        new StatTableAscensionScale({{
            stat: 'def_base',
            base: {base['def']},
            ascension: new StatTable('', {def_asc}),
            scale: charScales.{scale},
        }}),
        new StatTableAscensionScale({{
            stat: 'hp_base',
            base: {base['hp']},
            ascension: new StatTable('', {hp_asc}),
            scale: charScales.{scale},
        }}),
        new StatTableAscensionScale({{
            stat: 'recharge_base',
            base: 100,
        }}),
    ],'''

if __name__ == '__main__':
    dirname = os.path.dirname(__file__)
    chars_dir = os.path.join(dirname, '../персы')
    
    print("// Generated CharTables")
    print()
    
    for filename, config in CHARS.items():
        filepath = os.path.join(chars_dir, f'{filename}.txt')
        if os.path.exists(filepath):
            stats = parse_char_file(filepath)
            if stats:
                table = generate_char_table(config['name'], stats, config['rarity'], config['bonus_stat'])
                print(table)
                print()
