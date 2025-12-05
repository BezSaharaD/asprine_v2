import os
import re
from html.parser import HTMLParser

class CharParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.data = {}
        self.current_tag = None
        self.in_table = False
        self.current_row = []
        self.rows = []
        self.capture_text = False
        self.text_buffer = ""
        
    def handle_starttag(self, tag, attrs):
        self.current_tag = tag
        attrs_dict = dict(attrs)
        
        if tag == 'table':
            self.in_table = True
            self.rows = []
        elif tag == 'tr' and self.in_table:
            self.current_row = []
        elif tag == 'td' and self.in_table:
            self.capture_text = True
            self.text_buffer = ""
            
    def handle_endtag(self, tag):
        if tag == 'td' and self.capture_text:
            self.current_row.append(self.text_buffer.strip())
            self.capture_text = False
        elif tag == 'tr' and self.in_table and self.current_row:
            self.rows.append(self.current_row)
        elif tag == 'table':
            self.in_table = False
            
    def handle_data(self, data):
        if self.capture_text:
            self.text_buffer += data

def extract_char_info(html_content, filename):
    """Extract character info from HTML"""
    result = {
        'name_rus': '',
        'name_eng': '',
        'element': '',
        'weapon': '',
        'rarity': 5,
        'hp_base': 0,
        'atk_base': 0,
        'def_base': 0,
        'hp_90': 0,
        'atk_90': 0,
        'def_90': 0,
        'ascension_stat': '',
        'ascension_value': 0,
    }
    
    # Extract name from title
    title_match = re.search(r'<title>([^|<]+)', html_content)
    if title_match:
        result['name_rus'] = title_match.group(1).strip()
    
    # Extract English name from URL
    eng_match = re.search(r'hreflang="en"[^>]*href="[^"]*?/([a-z_]+)_\d+/', html_content, re.I)
    if eng_match:
        result['name_eng'] = eng_match.group(1).replace('_', ' ').title()
    
    # Extract rarity
    if 'rar_bg_4' in html_content or '4star' in html_content.lower():
        result['rarity'] = 4
    
    # Extract element
    elements = {
        'pyro': 'pyro', 'fire': 'pyro',
        'hydro': 'hydro', 'water': 'hydro',
        'anemo': 'anemo', 'wind': 'anemo',
        'electro': 'electro', 'electric': 'electro',
        'dendro': 'dendro', 'grass': 'dendro',
        'cryo': 'cryo', 'ice': 'cryo',
        'geo': 'geo', 'rock': 'geo',
    }
    
    for elem_key, elem_val in elements.items():
        if re.search(rf'\b{elem_key}\b', html_content, re.I):
            result['element'] = elem_val
            break
    
    # Extract weapon type
    weapons = {
        'sword': 'sword', 'меч': 'sword',
        'claymore': 'claymore', 'двуручн': 'claymore',
        'polearm': 'polearm', 'древков': 'polearm', 'копь': 'polearm',
        'bow': 'bow', 'лук': 'bow',
        'catalyst': 'catalyst', 'катализатор': 'catalyst',
    }
    
    for weap_key, weap_val in weapons.items():
        if re.search(rf'\b{weap_key}', html_content, re.I):
            result['weapon'] = weap_val
            break
    
    # Extract base stats from tables
    # Look for HP, ATK, DEF values
    stat_patterns = [
        (r'(?:Base HP|HP|Базовое HP|Макс\.?\s*HP)[^\d]*(\d[\d\s,\.]+)', 'hp'),
        (r'(?:Base ATK|ATK|Базовая атака|Сила атаки)[^\d]*(\d[\d\s,\.]+)', 'atk'),
        (r'(?:Base DEF|DEF|Базовая защита|Защита)[^\d]*(\d[\d\s,\.]+)', 'def'),
    ]
    
    for pattern, stat in stat_patterns:
        matches = re.findall(pattern, html_content, re.I)
        if matches:
            # First value is usually base, last is max
            values = [float(m.replace(' ', '').replace(',', '.')) for m in matches if m.strip()]
            if values:
                result[f'{stat}_base'] = values[0]
                if len(values) > 1:
                    result[f'{stat}_90'] = values[-1]
    
    return result

def main():
    chars_dir = 'персы'
    results = []
    
    for filename in os.listdir(chars_dir):
        if filename.endswith('.htm') or filename.endswith('.html'):
            filepath = os.path.join(chars_dir, filename)
            print(f"Processing: {filename}")
            
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            info = extract_char_info(content, filename)
            results.append(info)
            
            print(f"  Name: {info['name_rus']} / {info['name_eng']}")
            print(f"  Element: {info['element']}, Weapon: {info['weapon']}, Rarity: {info['rarity']}*")
            print()
    
    return results

if __name__ == '__main__':
    main()
