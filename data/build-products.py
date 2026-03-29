#!/usr/bin/env python3
"""Build products.js from all_sheets.json"""
import json
import os
import re

with open(os.path.join(os.path.dirname(__file__), 'all_sheets.json'), 'r', encoding='utf-8') as f:
    data = json.load(f)

# Load image URL mapping
with open(os.path.join(os.path.dirname(__file__), 'image_urls.json'), 'r', encoding='utf-8') as f:
    image_urls = json.load(f)

# Build filename -> URL maps
_img_exact = {}
_img_norm = {}
def _normalize(s):
    return re.sub(r'[-_ ()]', '', s.lower())

for url in image_urls:
    fname = url.split('/')[-1]
    key = fname.lower()
    nkey = _normalize(fname)
    # Prefer highest resolution
    def _better(url, old):
        if not old: return True
        if '550_420' in url: return True
        if '/iblock/' in url and 'resize_cache' not in url and '550' not in old: return True
        return False
    if _better(url, _img_exact.get(key)):
        _img_exact[key] = url
    if _better(url, _img_norm.get(nkey)):
        _img_norm[nkey] = url

def find_image(filename):
    """Find best image URL for a spreadsheet filename."""
    if not filename:
        return ''
    key = filename.strip().lower()
    nkey = _normalize(filename)
    return _img_exact.get(key) or _img_norm.get(nkey) or ''

# Series image fallbacks (for converters that share series images)
SERIES_IMAGES = {}
for sheet_name, sheet in data.items():
    if not isinstance(sheet, dict) or 'products' not in sheet:
        continue
    for p in sheet.get('products', []):
        pic = p.get('IE_PREVIEW_PICTURE', '').strip()
        url = find_image(pic)
        if url and p.get('SERIES'):
            SERIES_IMAGES[p['SERIES']] = url

# Fallback images by subcategory/section
SUBCATEGORY_IMAGES = {
    # Capacitors
    'ARC70A': 'https://ekb-test.ru/upload/uf/bf0/k29x09kqdlzz4b06klqe20e6thwvxga4/ARC70A.jpg',
    'ARC70C': 'https://ekb-test.ru/upload/uf/582/q6hmgve7f71xy16qieeg90n1cywf0y0y/ARC70C.jpg',
    'ARC70E': 'https://ekb-test.ru/upload/uf/ce6/2vqfe2coot0maq0othg34x81elqygozw/ARC70E.jpg',
    'СВЧ-конденсаторы': 'https://ekb-test.ru/upload/uf/bf0/k29x09kqdlzz4b06klqe20e6thwvxga4/ARC70A.jpg',
    'ATC': 'https://ekb-test.ru/upload/uf/bf0/k29x09kqdlzz4b06klqe20e6thwvxga4/ARC70A.jpg',
    'PPI': 'https://ekb-test.ru/upload/uf/bf0/k29x09kqdlzz4b06klqe20e6thwvxga4/ARC70A.jpg',
    'DLC': 'https://ekb-test.ru/upload/uf/bf0/k29x09kqdlzz4b06klqe20e6thwvxga4/ARC70A.jpg',
    'Гериконд': 'https://ekb-test.ru/upload/uf/bf0/k29x09kqdlzz4b06klqe20e6thwvxga4/ARC70A.jpg',
    # Converters
    'ИРТЫШ': 'https://ekb-test.ru/upload/uf/271/yd5fgpnlh4jz3b36j91vmefzo6oz6ewl/Irtysh.jpg',
    'ВОЛГА': 'https://ekb-test.ru/upload/uf/505/f93v1z4bii6c43q91viijntad0lkbov1/Volga.jpg',
    'ЕНИСЕЙ': 'https://ekb-test.ru/upload/uf/d95/ik7ot9ph8i9wpj7juqp6x36qfclatpva/Yenisey.jpg',
    'КАМА': 'https://ekb-test.ru/upload/uf/f46/jgs9hu3i0if61o678lw25r5spwb92tdz/Kama.jpg',
    'Vicor': 'https://ekb-test.ru/upload/uf/271/yd5fgpnlh4jz3b36j91vmefzo6oz6ewl/Irtysh.jpg',
    'преобразовател': 'https://ekb-test.ru/upload/uf/271/yd5fgpnlh4jz3b36j91vmefzo6oz6ewl/Irtysh.jpg',
    # Transistors
    'LDMOS': 'https://ekb-test.ru/upload/uf/f8e/0eie6w0my0lxha7vuusrgxzrvtbdknl9/LDMOS_Microwave_Transistors.jpg',
    'СВЧ-транзистор': 'https://ekb-test.ru/upload/uf/f8e/0eie6w0my0lxha7vuusrgxzrvtbdknl9/LDMOS_Microwave_Transistors.jpg',
    # Microchips
    'Миландр': 'https://ekb-test.ru/upload/uf/271/yd5fgpnlh4jz3b36j91vmefzo6oz6ewl/Irtysh.jpg',
    'Микросхемы': 'https://ekb-test.ru/upload/uf/271/yd5fgpnlh4jz3b36j91vmefzo6oz6ewl/Irtysh.jpg',
}

# Connector name -> image mapping (Cyrillic product names -> Latin URLs from ekb-test.ru)
CONNECTOR_IMAGES = {
    'СНЦ': 'https://ekb-test.ru/upload/uf/87c/o1b71skcv4qu74cc1wsksmxguo8uvn9u/ET_SNC23.jpg',
    '2РМГ': 'https://ekb-test.ru/upload/uf/5bd/u3po5v8t81supqunuzxzcrmn7u711lpb/ET_2RMG_D_.jpg',
    '2РМД': 'https://ekb-test.ru/upload/uf/01b/qk1r2f2wv93t7detnjv8zw4fe9fvxuqd/ET_2RM_D_T.jpg',
    '2РМ': 'https://ekb-test.ru/upload/uf/01b/qk1r2f2wv93t7detnjv8zw4fe9fvxuqd/ET_2RM_D_T.jpg',
    '2РТТ': 'https://ekb-test.ru/upload/uf/a74/b2llibz71tu1zjl3ebwjru2clkx3rjpw/ET_2RTT.jpg',
    'ШР': 'https://ekb-test.ru/upload/uf/a74/b2llibz71tu1zjl3ebwjru2clkx3rjpw/ET_2RTT.jpg',
    'СШР': 'https://ekb-test.ru/upload/uf/a74/b2llibz71tu1zjl3ebwjru2clkx3rjpw/ET_2RTT.jpg',
    'РБМ': 'https://ekb-test.ru/upload/uf/87c/o1b71skcv4qu74cc1wsksmxguo8uvn9u/ET_SNC23.jpg',
    'СНО': 'https://ekb-test.ru/upload/uf/87c/o1b71skcv4qu74cc1wsksmxguo8uvn9u/ET_SNC23.jpg',
    'СНП': 'https://ekb-test.ru/upload/uf/87c/o1b71skcv4qu74cc1wsksmxguo8uvn9u/ET_SNC23.jpg',
    'РП': 'https://ekb-test.ru/upload/uf/01b/qk1r2f2wv93t7detnjv8zw4fe9fvxuqd/ET_2RM_D_T.jpg',
    'РС': 'https://ekb-test.ru/upload/uf/01b/qk1r2f2wv93t7detnjv8zw4fe9fvxuqd/ET_2RM_D_T.jpg',
    'СР': 'https://ekb-test.ru/upload/uf/01b/qk1r2f2wv93t7detnjv8zw4fe9fvxuqd/ET_2RM_D_T.jpg',
    'РВН': 'https://ekb-test.ru/upload/uf/87c/o1b71skcv4qu74cc1wsksmxguo8uvn9u/ET_SNC23.jpg',
    '4РТ': 'https://ekb-test.ru/upload/uf/a74/b2llibz71tu1zjl3ebwjru2clkx3rjpw/ET_2RTT.jpg',
    'ОНЦ': 'https://ekb-test.ru/upload/uf/87c/o1b71skcv4qu74cc1wsksmxguo8uvn9u/ET_SNC23.jpg',
    'АЭР': 'https://ekb-test.ru/upload/uf/87c/o1b71skcv4qu74cc1wsksmxguo8uvn9u/ET_SNC23.jpg',
}

def find_subcategory_image(subcategory):
    """Find fallback image by subcategory name."""
    if not subcategory:
        return ''
    for key, url in SUBCATEGORY_IMAGES.items():
        if key in subcategory or subcategory in key:
            return url
    return ''

def find_connector_image(name):
    """Find fallback image for a connector by product name."""
    if not name:
        return ''
    # Check longer keys first to avoid false matches (e.g. 2РМГ before 2РМ)
    for key in sorted(CONNECTOR_IMAGES.keys(), key=len, reverse=True):
        if key in name:
            return CONNECTOR_IMAGES[key]
    return ''

products = []
pid = 1

def clean(val):
    """Clean a value - strip quotes, whitespace, #### separators"""
    if not val:
        return ''
    s = str(val).strip().replace('"', '').strip()
    # Replace #### separator with comma-space
    s = s.replace('####', ', ')
    # Clean up extra whitespace
    s = ' '.join(s.split())
    return s

# --- 1. Микросхемы (51) ---
chips = data.get('Микросхемы', {})
for p in chips.get('products', []):
    if p.get('IE_ACTIVE') != 'Y':
        continue
    specs = {}
    if p.get('TYPE_OF_SHELL'): specs['Тип корпуса'] = p['TYPE_OF_SHELL']
    if p.get('APPOINTMENT'): specs['Тип'] = p['APPOINTMENT']
    v_from = p.get('INPUT_VOLTAGE_FROM', '')
    v_to = p.get('INPUT_VOLTAGE_TO', '')
    if v_from or v_to:
        specs['Входное напряжение'] = f"{v_from}–{v_to} В" if v_from and v_to else f"{v_from or v_to} В"
    if p.get('OUTPUT_VOLTAGE'): specs['Выходное напряжение'] = p['OUTPUT_VOLTAGE']
    if p.get('EFFICIENCY'): specs['КПД'] = p['EFFICIENCY']
    if p.get('IDLE_CONSUMPTION_CURRENT'): specs['Ток холостого хода'] = p['IDLE_CONSUMPTION_CURRENT']
    if p.get('WORK_FREQUENCY_MHZ'): specs['Рабочая частота'] = f"{p['WORK_FREQUENCY_MHZ']} МГц"
    t_from = p.get('WORKING_TEMPERATURE_RANGE_FROM', '')
    t_to = p.get('WORKING_TEMPERATURE_RANGE_TO', '')
    if t_from or t_to:
        specs['Температурный диапазон'] = f"{t_from}…{t_to} °C"
    if p.get('INFORMATION_CAPACITY'): specs['Ёмкость'] = p['INFORMATION_CAPACITY']
    if p.get('POWER_VOLTAGES'): specs['Напряжение питания'] = p['POWER_VOLTAGES']
    if p.get('DISTINCTIVE_FEATURES'): specs['Особенности'] = p['DISTINCTIVE_FEATURES']

    img = find_image(p.get('IE_PREVIEW_PICTURE')) or find_image(p.get('IE_DETAIL_PICTURE')) or find_subcategory_image(p.get('IC_GROUP0', ''))
    products.append({
        'id': pid,
        'name': p.get('PARTNUMBER') or p.get('IE_NAME', ''),
        'category': 'Микросхемы',
        'subcategory': p.get('IC_GROUP0', 'Микросхемы ЭКБ ТЕСТ'),
        'description': p.get('DESCRIPTION_TECH') or p.get('IE_NAME', ''),
        'image': img,
        'specs': specs
    })
    pid += 1

# --- 2. Разъёмы (51, без дублей) ---
conns = data.get('Разъёмы (без дублей)', {})
for p in conns.get('products', []):
    if p.get('IE_ACTIVE') != 'Y':
        continue
    specs = {}
    c_from = p.get('NUMBER_OF_CONTACTS_FROM', '')
    c_to = p.get('NUMBER_OF_CONTACTS_TO', '')
    if c_from or c_to:
        specs['Количество контактов'] = f"{c_from}–{c_to}" if c_from and c_to else str(c_from or c_to)
    t_from = p.get('TEMPERATURE_RANGE_FROM', '')
    t_to = p.get('TEMPERATURE_RANGE_TO', '')
    if t_from or t_to:
        specs['Температурный диапазон'] = f"{t_from}…{t_to} °C"
    if p.get('MAXIMUM_OPERATING_VOLTAGE'): specs['Макс. рабочее напряжение'] = f"{p['MAXIMUM_OPERATING_VOLTAGE']} В"
    if p.get('TYPE_OF_PRODUCT'): specs['Тип'] = p['TYPE_OF_PRODUCT']
    if p.get('CONTACT_RESISTANCE_OM'): specs['Сопротивление контактов'] = f"{p['CONTACT_RESISTANCE_OM']} Ом"
    if p.get('WAVE_RESISTANCE_OM'): specs['Волновое сопротивление'] = f"{p['WAVE_RESISTANCE_OM']} Ом"

    pname = p.get('PARTNUMBER') or p.get('IE_NAME', '')
    img = find_image(p.get('IE_PREVIEW_PICTURE')) or find_image(p.get('IE_DETAIL_PICTURE')) or find_connector_image(pname)
    products.append({
        'id': pid,
        'name': pname,
        'category': 'Разъёмы',
        'subcategory': p.get('IC_GROUP0', 'Разъёмы ЭКБ ТЕСТ'),
        'description': p.get('IE_NAME', ''),
        'image': img,
        'specs': specs
    })
    pid += 1

# --- 3. Преобразователи напряжения (538) ---
convs = data.get('Производство преобразователей', {})
for p in convs.get('products', []):
    if p.get('IE_ACTIVE') != 'Y':
        continue
    specs = {}
    if p.get('TYPE'): specs['Тип'] = p['TYPE']
    if p.get('SERIES'): specs['Серия'] = p['SERIES']
    if p.get('NOMINAL_INPUT_VOLTAGE'):
        specs['Входное напряжение'] = clean(p['NOMINAL_INPUT_VOLTAGE']) + ' В'
    if p.get('OUTPUT_VOLTAGE'): specs['Выходное напряжение'] = f"{p['OUTPUT_VOLTAGE']} В"
    if p.get('POWER'): specs['Мощность'] = f"{p['POWER']} Вт"
    if p.get('TYPE_OF_SHELL'): specs['Тип корпуса'] = p['TYPE_OF_SHELL']
    dims = [p.get('THE_DIMENSIONS_OF_THE_CASE_X'), p.get('THE_DIMENSIONS_OF_THE_CASE_Y'), p.get('THE_DIMENSIONS_OF_THE_CASE_Z')]
    dims = [d for d in dims if d]
    if dims:
        specs['Размеры'] = ' × '.join(str(d) for d in dims) + ' мм'
    if p.get('TEMPERATURE_RANGE'):
        specs['Температурный диапазон'] = clean(p['TEMPERATURE_RANGE'])
    if p.get('MAXIMUM_PASSING_CURRENT'):
        specs['Макс. ток'] = f"{p['MAXIMUM_PASSING_CURRENT']} А"

    img = find_image(p.get('IE_PREVIEW_PICTURE')) or find_image(p.get('IE_DETAIL_PICTURE')) or SERIES_IMAGES.get(p.get('SERIES', ''), '') or find_subcategory_image(p.get('IC_GROUP0', ''))
    products.append({
        'id': pid,
        'name': p.get('PARTNUMBER') or p.get('IE_NAME', ''),
        'category': 'Преобразователи напряжения',
        'subcategory': p.get('IC_GROUP0', 'Преобразователи'),
        'description': p.get('IE_NAME', ''),
        'image': img,
        'specs': specs
    })
    pid += 1

# --- 4. СВЧ-конденсаторы (90) ---
caps = data.get('СВЧ-конденсаторы', {})
for p in caps.get('products', []):
    if p.get('IE_ACTIVE') != 'Y':
        continue
    specs = {}
    if p.get('PICOPARAD_PF'): specs['Ёмкость'] = f"{p['PICOPARAD_PF']} пФ"
    if p.get('FRAME'): specs['Корпус'] = p['FRAME']
    if p.get('RATED_VOLTAGE'): specs['Номинальное напряжение'] = p['RATED_VOLTAGE']
    t_from = p.get('THE_RANGE_OF_OPERATING_TEMPERATURES_FROM', '')
    t_to = p.get('THE_RANGE_OF_OPERATING_TEMPERATURES_TO', '')
    if t_from or t_to:
        specs['Температурный диапазон'] = f"{t_from}…{t_to} °C"
    a_from = p.get('ACCURACY_FROM', '')
    a_to = p.get('ACCURACY_TO', '')
    if a_from or a_to:
        specs['Точность'] = f"{a_from} … {a_to}" if a_from and a_to else str(a_from or a_to)
    if p.get('TYPE'): specs['Тип'] = p['TYPE']
    if p.get('APPLICATION_AREA'): specs['Область применения'] = p['APPLICATION_AREA']

    img = find_image(p.get('IE_PREVIEW_PICTURE')) or find_image(p.get('IE_DETAIL_PICTURE')) or find_subcategory_image(p.get('IC_GROUP0', ''))
    products.append({
        'id': pid,
        'name': p.get('PARTNUMBER') or p.get('CODE') or p.get('IE_NAME', ''),
        'category': 'СВЧ-конденсаторы',
        'subcategory': p.get('IC_GROUP0', 'СВЧ-конденсаторы'),
        'description': p.get('IE_NAME', ''),
        'image': img,
        'specs': specs
    })
    pid += 1

# --- 5. СВЧ-транзисторы (38) ---
trans = data.get('Отечественные замены радиочастотных компонентов', {})
for p in trans.get('products', []):
    if p.get('IE_ACTIVE') != 'Y':
        continue
    specs = {}
    if p.get('TYPE'): specs['Тип'] = p['TYPE']
    if p.get('POWER'): specs['Мощность'] = f"{p['POWER']} Вт"
    if p.get('WORK_VOLTAGE'): specs['Рабочее напряжение'] = f"{p['WORK_VOLTAGE']} В"
    if p.get('GAIN'): specs['Усиление'] = f"{p['GAIN']} дБ"
    if p.get('THE_BOUNDARY_FREQUENCY_OF_AMPLIFICATION_TO_THE_GHZ'):
        specs['Граничная частота'] = f"{p['THE_BOUNDARY_FREQUENCY_OF_AMPLIFICATION_TO_THE_GHZ']} ГГц"
    if p.get('TYPE_OF_SHELL'): specs['Тип корпуса'] = p['TYPE_OF_SHELL']
    dims = [p.get('BODY_SIZE_X'), p.get('BODY_SIZE_Y'), p.get('BODY_SIZE_Z')]
    dims = [d for d in dims if d]
    if dims:
        specs['Размеры корпуса'] = ' × '.join(str(d) for d in dims) + ' мм'

    img = find_image(p.get('IE_PREVIEW_PICTURE')) or find_image(p.get('IE_DETAIL_PICTURE')) or find_subcategory_image(p.get('IC_GROUP0', ''))
    products.append({
        'id': pid,
        'name': p.get('PARTNUMBER') or p.get('IE_NAME', ''),
        'category': 'СВЧ-транзисторы',
        'subcategory': p.get('IC_GROUP0', 'СВЧ-транзисторы'),
        'description': p.get('IE_NAME', ''),
        'image': img,
        'specs': specs
    })
    pid += 1

# --- Post-process: clean all string values ---
for p in products:
    p['name'] = clean(p['name'])
    p['subcategory'] = clean(p['subcategory'])
    p['description'] = clean(p['description'])
    cleaned_specs = {}
    for k, v in p['specs'].items():
        cleaned_specs[k] = clean(v)
    p['specs'] = cleaned_specs

# --- Output ---
out_path = os.path.join(os.path.dirname(__file__), '..', 'site', 'demo project', 'ic farvater', 'js', 'products.js')

lines = []
lines.append('// Каталог продуктов ИК Фарватер')
lines.append(f'// Данные из Google Spreadsheet — {len(products)} продуктов, 5 категорий')
lines.append('// Сгенерировано автоматически из all_sheets.json\n')
lines.append('const PRODUCTS = ' + json.dumps(products, ensure_ascii=False, indent=2) + ';\n')

with open(out_path, 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

# Stats
cats = {}
for p in products:
    cats[p['category']] = cats.get(p['category'], 0) + 1
print(f'Total products: {len(products)}')
for cat, count in cats.items():
    print(f'  {cat}: {count}')
