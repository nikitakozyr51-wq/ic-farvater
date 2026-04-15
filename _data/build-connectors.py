#!/usr/bin/env python3
"""Parse price list → js/connectors-data.js"""
import sys, re, json
sys.stdout.reconfigure(encoding='utf-8')

PRICE_PATH = r"D:\Загрузки\экб подкаталог\Прайс-лист эл. соединители ЭКБ ТЕСТ от 01.01.2026 (2).txt"
OUT_PATH = r"D:\site\js\connectors-data.js"

# Series grouping rules: regex → (slug, display_name, group)
# group: "main" | "additional" | "dev"
SERIES_RULES = [
    # Main 10 (from brochure)
    (r'^ЕТ-2РМ[ДD]?Т',       'et-2rmt',    'ЕТ-2РМТ / ЕТ-2РМДТ',        'main'),
    (r'^ЕТ-2РТТ',             'et-2rtt',    'ЕТ-2РТТ',                    'main'),
    (r'^ЕТ-ОНЦ-БС',           'et-onc-bs',  'ЕТ-ОНЦ-БС',                  'main'),
    (r'^ЕТ-РС[ГG]?',          'et-rsg',     'ЕТ-РС(Г)',                    'main'),
    (r'^ЕТ-РРС',              'et-rrs',     'ЕТ-РРС (3/4/5)',             'main'),
    (r'^ЕТ-МР1',              'et-mr1',     'ЕТ-МР1',                     'main'),
    (r'^ЕТ-2РМГ(?!П)[ДD]?',   'et-2rmg',    'ЕТ-2РМГ(Д)',                  'main'),
    (r'^ЕТ-[СC]НЦ\s*23',      'et-snc23',   'ЕТ-СНЦ23',                   'main'),
    (r'^ЕТ-СНЦ28',            'et-snc28',   'ЕТ-СНЦ28',                   'main'),
    (r'^ЕТ-СНЦ\s*144|^ЕТ-144', 'et-snc144',  'ЕТ-СНЦ144 / ЕТ-144',         'main'),

    # Additional
    (r'^ЕТ-ШР',               'et-shr',     'ЕТ-ШР',                      'additional'),
    (r'^ЕТ-ЭК|^ЕТ-ЭП',       'et-ek-ep',   'ЕТ-ЭК / ЕТ-ЭП (заглушки)',   'additional'),

    # В разработке
    (r'^ЕТ-ОНЦ-БМ',           'et-onc-bm',  'ЕТ-ОНЦ-БМ',                  'dev'),
    (r'^ЕТ-СНЦ127',           'et-snc127',  'ЕТ-СНЦ127',                  'dev'),
    (r'^ЕТ-РВН2',             'et-rvn2',    'ЕТ-РВН2',                    'dev'),
    (r'^ЕТ-2РМП',             'et-2rmp',    'ЕТ-2РМП',                    'dev'),
    (r'^ЕТ-СНЦ147',           'et-snc147',  'ЕТ-СНЦ147',                  'dev'),
    (r'^ЕТ-РБН2',             'et-rbn2',    'ЕТ-РБН2',                    'dev'),
    (r'^ЕТ-СНЦ13(?!$|\d{2})', 'et-snc13',   'ЕТ-СНЦ13',                   'dev'),
]

# Extra dev series без позиций в прайсе (placeholder-карточки)
EXTRA_DEV_SERIES = [
    ('et-snc146', 'ЕТ-СНЦ146', '', 'В разработке. ТУ не утверждены.'),
    ('et-snc233', 'ЕТ-СНЦ233', '', 'В разработке. ТУ не утверждены.'),
    ('et-rbm4',   'ЕТ-РБМ4',   '', 'В разработке. ТУ не утверждены.'),
    ('et-rvn1',   'ЕТ-РВН1',   '', 'В разработке. ТУ не утверждены.'),
]

# Exclude these
EXCLUDE = [r'^ЕТ-2РМГП']

# TU mapping (from plan)
TU_MAP = {
    'et-2rmt':   'ТКЕС.434410.016 ТУ',
    'et-2rtt':   'ТКЕС.434410.005 ТУ',
    'et-onc-bs': 'ТКЕС.434410.024 ТУ',
    'et-rsg':    'ТКЕС.434410.026 ТУ',
    'et-rrs':    'ТКЕС.434410.045 ТУ',
    'et-mr1':    'ТКЕС.434410.032 ТУ',
    'et-2rmg':   'ТКЕС.434410.039 ТУ',
    'et-snc23':  'ТКЕС.434410.014 ТУ',
    'et-snc28':  'ТКЕС.434410.012 ТУ',
    'et-snc144': 'ТКЕС.434410.049 ТУ',
    'et-onc-bm': 'ТКЕС.434410.047 ТУ',
    'et-snc127': 'ТКЕС.434410.007 ТУ',
    'et-shr':    'ТКЕС.434410.003 ТУ',
    'et-rvn2':   'ТКЕС.434410.020 ТУ',
}

# Individual images — fallback to connectors.png
BASE = '../assets/images/products/connectors/'
IMAGE_MAP = {
    'et-2rmt':   BASE + 'et-2rmt.webp',
    'et-2rtt':   BASE + 'et-2rtt.webp',
    'et-2rmg':   BASE + 'et-2rmg.webp',
    'et-snc23':  BASE + 'et-snc23.webp',
    'et-snc28':  BASE + 'et-snc28.webp',
    'et-snc144': BASE + 'et-snc144.webp',
    'et-mr1':    BASE + 'et-mr1.webp',
    'et-onc-bs': BASE + 'et-onc-bs.webp',
    'et-rrs':    BASE + 'et-rrs.webp',
    'et-ek-ep':  '../assets/images/products/connectors.webp',
    'et-onc-bm': BASE + 'et-onc-bm.webp',
    'et-snc127': BASE + 'et-snc127.webp',
    'et-rvn2':   BASE + 'et-rvn2.webp',
    'et-snc13':  BASE + 'et-snc13.webp',
    'et-snc146': BASE + 'et-snc146.webp',
    'et-snc233': BASE + 'et-snc233.webp',
    'et-rbm4':   BASE + 'et-rbm4.webp',
    'et-rvn1':   BASE + 'et-rvn1.webp',
}
# Per-variant images by type (Вилка/Розетка)
IMAGE_BY_TYPE = {
    'et-2rmt':   {'Вилка': BASE + 'et-2rmt-vilka.webp',   'Розетка': BASE + 'et-2rmt-rozetka.webp'},
    'et-2rmg':   {'Вилка': BASE + 'et-2rmt-vilka.webp',   'Розетка': BASE + 'et-2rmt-rozetka.webp'},
    'et-onc-bs': {'Вилка': BASE + 'et-onc-bs-vilka.webp', 'Розетка': BASE + 'et-onc-bs-rozetka.webp'},
    'et-rrs':    {'Вилка': BASE + 'et-rrs-vilka.webp',    'Розетка': BASE + 'et-rrs-rozetka.webp'},
    'et-snc144': {'Вилка': BASE + 'et-snc144-vilka.webp', 'Розетка': BASE + 'et-snc144-rozetka.webp'},
}
IMAGE_FALLBACK = '../assets/images/products/connectors.webp'

# Short descriptions for cards
DESC_MAP = {
    'et-2rmt':   'Цилиндрические разъёмы с байонетной фиксацией. Ток 5–40 А, до 150°C.',
    'et-2rtt':   'Прямоугольные разъёмы с током до 200 А.',
    'et-onc-bs': 'Быстросъёмные одноконтактные соединители.',
    'et-rsg':    'Радиочастотные соединители серии РС(Г).',
    'et-rrs':    'Герметичные разъёмы для частот до 3 МГц, 200 В.',
    'et-mr1':    'Малогабаритные разъёмы серии МР1.',
    'et-2rmg':   'Герметичные цилиндрические, вибрация 50g, до 200°C.',
    'et-snc23':  'Байонетные с экранированием от ЭМП, 700 В.',
    'et-snc28':  'Цилиндрические соединители серии СНЦ28.',
    'et-snc144': 'Совместимы с MIL-DTL-38999. Экран 65–85 дБ, 15 лет.',
    'et-onc-bm': 'Байонетные, -60…+85°C, удар 10000 м/с².',
    'et-snc127': 'Цилиндрические соединители серии СНЦ127.',
    'et-shr':    'Штепсельные разъёмы серии ШР.',
    'et-rvn2':   'Разъёмы врубного типа серии РВН2.',
    'et-ek-ep':  'Заглушки для разъёмов серий ЕТ.',
    'et-2rmp':   'В разработке. ТУ не утверждены.',
    'et-snc147': 'В разработке. ТУ не утверждены.',
    'et-rbn2':   'В разработке. ТУ не утверждены.',
    'et-snc13':  'Частично в разработке.',
}

def classify(name):
    """Return (slug, display, group) or None if excluded."""
    for pat in EXCLUDE:
        if re.search(pat, name):
            return None
    for pat, slug, display, group in SERIES_RULES:
        if re.search(pat, name):
            return slug, display, group
    return None

def main():
    items = []
    with open(PRICE_PATH, 'r', encoding='cp1251') as f:
        for line in f:
            line = line.strip()
            if not line:
                continue
            parts = line.split('\t')
            if len(parts) < 3:
                continue
            num = parts[0].strip()
            if not num.isdigit():
                continue
            name = parts[1].strip()
            typ = parts[2].strip() if len(parts) > 2 else ''
            tu = parts[3].strip() if len(parts) > 3 else ''
            items.append({'name': name, 'type': typ, 'tu': tu})

    # Group by series
    series_data = {}
    unmatched = []
    for item in items:
        result = classify(item['name'])
        if result is None:
            # Check if explicitly excluded
            excluded = False
            for pat in EXCLUDE:
                if re.search(pat, item['name']):
                    excluded = True
                    break
            if not excluded:
                unmatched.append(item['name'])
            continue
        slug, display, group = result
        if slug not in series_data:
            series_data[slug] = {
                'slug': slug,
                'name': display,
                'group': group,
                'tu': TU_MAP.get(slug, ''),
                'description': DESC_MAP.get(slug, ''),
                'image': IMAGE_MAP.get(slug, IMAGE_FALLBACK),
                'imageByType': IMAGE_BY_TYPE.get(slug, {}),
                'items': []
            }
        series_data[slug]['items'].append({
            'name': item['name'],
            'type': item['type'],
            'tu': item['tu']
        })

    # Append placeholder dev series (no price-list entries)
    for slug, display, tu, desc in EXTRA_DEV_SERIES:
        if slug in series_data:
            continue
        series_data[slug] = {
            'slug': slug,
            'name': display,
            'group': 'dev',
            'tu': tu,
            'description': desc,
            'image': IMAGE_MAP.get(slug, IMAGE_FALLBACK),
            'imageByType': {},
            'items': []
        }

    if unmatched:
        print(f"WARNING: {len(unmatched)} unmatched items:")
        for u in unmatched[:10]:
            print(f"  {u}")

    # Sort: main first, then additional, then dev
    order = {'main': 0, 'additional': 1, 'dev': 2}
    sorted_series = sorted(series_data.values(), key=lambda s: (order[s['group']], s['slug']))

    # Print stats
    for s in sorted_series:
        print(f"  [{s['group']:10}] {s['name']:30} → {len(s['items'])} items")

    # Generate JS
    js_lines = ['// Auto-generated from price list. Do not edit manually.',
                 '// Generated by _data/build-connectors.py',
                 '',
                 'var CONNECTOR_SERIES = [']

    for s in sorted_series:
        js_lines.append('  {')
        js_lines.append(f'    slug: {json.dumps(s["slug"])},')
        js_lines.append(f'    name: {json.dumps(s["name"])},')
        js_lines.append(f'    group: {json.dumps(s["group"])},')
        js_lines.append(f'    tu: {json.dumps(s["tu"])},')
        js_lines.append(f'    description: {json.dumps(s["description"])},')
        js_lines.append(f'    image: {json.dumps(s["image"])},')
        js_lines.append(f'    imageByType: {json.dumps(s["imageByType"], ensure_ascii=False)},')
        js_lines.append(f'    count: {len(s["items"])},')
        js_lines.append(f'    items: [')
        for item in s['items']:
            js_lines.append(f'      {{ name: {json.dumps(item["name"])}, type: {json.dumps(item["type"])}, tu: {json.dumps(item["tu"])} }},')
        js_lines.append('    ]')
        js_lines.append('  },')

    js_lines.append('];')
    js_lines.append('')

    with open(OUT_PATH, 'w', encoding='utf-8') as f:
        f.write('\n'.join(js_lines))

    total = sum(len(s['items']) for s in sorted_series)
    print(f"\nTotal: {total} items in {len(sorted_series)} series → {OUT_PATH}")

if __name__ == '__main__':
    main()
