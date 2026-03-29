// Build products.js from all_sheets.json
const fs = require('fs');
const path = require('path');

const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'all_sheets.json'), 'utf8'));

const products = [];
let id = 1;

// --- 1. Микросхемы (51) ---
const chips = data['Микросхемы'];
if (chips && chips.products) {
  for (const p of chips.products) {
    if (p.IE_ACTIVE !== 'Y') continue;
    const specs = {};
    if (p.TYPE_OF_SHELL) specs['Тип корпуса'] = p.TYPE_OF_SHELL;
    if (p.APPOINTMENT) specs['Тип'] = p.APPOINTMENT;
    if (p.INPUT_VOLTAGE_FROM || p.INPUT_VOLTAGE_TO) {
      specs['Входное напряжение'] = [p.INPUT_VOLTAGE_FROM, p.INPUT_VOLTAGE_TO].filter(Boolean).join('–') + ' В';
    }
    if (p.OUTPUT_VOLTAGE) specs['Выходное напряжение'] = p.OUTPUT_VOLTAGE;
    if (p.EFFICIENCY) specs['КПД'] = p.EFFICIENCY;
    if (p.IDLE_CONSUMPTION_CURRENT) specs['Ток холостого хода'] = p.IDLE_CONSUMPTION_CURRENT;
    if (p.WORK_FREQUENCY_MHZ) specs['Рабочая частота'] = p.WORK_FREQUENCY_MHZ + ' МГц';
    if (p.WORKING_TEMPERATURE_RANGE_FROM || p.WORKING_TEMPERATURE_RANGE_TO) {
      specs['Температурный диапазон'] = (p.WORKING_TEMPERATURE_RANGE_FROM || '') + '…' + (p.WORKING_TEMPERATURE_RANGE_TO || '') + ' °C';
    }
    if (p.INFORMATION_CAPACITY) specs['Ёмкость'] = p.INFORMATION_CAPACITY;
    if (p.POWER_VOLTAGES) specs['Напряжение питания'] = p.POWER_VOLTAGES;
    if (p.DISTINCTIVE_FEATURES) specs['Особенности'] = p.DISTINCTIVE_FEATURES;

    products.push({
      id: id++,
      name: p.PARTNUMBER || p.IE_NAME,
      category: 'Микросхемы',
      subcategory: p.IC_GROUP0 || 'Микросхемы ЭКБ ТЕСТ',
      description: p.DESCRIPTION_TECH || p.IE_NAME || '',
      image: p.IE_PREVIEW_PICTURE ? 'https://ekb-test.ru/upload/resize_cache/uf/' + p.IE_PREVIEW_PICTURE : '',
      specs
    });
  }
}

// --- 2. Разъёмы (51, без дублей) ---
const conns = data['Разъёмы (без дублей)'];
if (conns && conns.products) {
  for (const p of conns.products) {
    if (p.IE_ACTIVE !== 'Y') continue;
    const specs = {};
    if (p.NUMBER_OF_CONTACTS_FROM || p.NUMBER_OF_CONTACTS_TO) {
      specs['Количество контактов'] = [p.NUMBER_OF_CONTACTS_FROM, p.NUMBER_OF_CONTACTS_TO].filter(Boolean).join('–');
    }
    if (p.TEMPERATURE_RANGE_FROM || p.TEMPERATURE_RANGE_TO) {
      specs['Температурный диапазон'] = (p.TEMPERATURE_RANGE_FROM || '') + '…' + (p.TEMPERATURE_RANGE_TO || '') + ' °C';
    }
    if (p.MAXIMUM_OPERATING_VOLTAGE) specs['Макс. рабочее напряжение'] = p.MAXIMUM_OPERATING_VOLTAGE + ' В';
    if (p.TYPE_OF_PRODUCT) specs['Тип'] = p.TYPE_OF_PRODUCT;
    if (p.CONTACT_RESISTANCE_OM) specs['Сопротивление контактов'] = p.CONTACT_RESISTANCE_OM + ' Ом';
    if (p.WAVE_RESISTANCE_OM) specs['Волновое сопротивление'] = p.WAVE_RESISTANCE_OM + ' Ом';

    products.push({
      id: id++,
      name: p.PARTNUMBER || p.IE_NAME,
      category: 'Разъёмы',
      subcategory: p.IC_GROUP0 || 'Разъёмы ЭКБ ТЕСТ',
      description: p.IE_NAME || '',
      image: p.IE_PREVIEW_PICTURE ? 'https://ekb-test.ru/upload/resize_cache/uf/' + p.IE_PREVIEW_PICTURE : '',
      specs
    });
  }
}

// --- 3. Преобразователи напряжения (538) ---
const convs = data['Производство преобразователей'];
if (convs && convs.products) {
  for (const p of convs.products) {
    if (p.IE_ACTIVE !== 'Y') continue;
    const specs = {};
    if (p.TYPE) specs['Тип'] = p.TYPE;
    if (p.SERIES) specs['Серия'] = p.SERIES;
    if (p.NOMINAL_INPUT_VOLTAGE) {
      let v = p.NOMINAL_INPUT_VOLTAGE.replace(/"/g, '').trim();
      specs['Входное напряжение'] = v + ' В';
    }
    if (p.OUTPUT_VOLTAGE) specs['Выходное напряжение'] = p.OUTPUT_VOLTAGE + ' В';
    if (p.POWER) specs['Мощность'] = p.POWER + ' Вт';
    if (p.TYPE_OF_SHELL) specs['Тип корпуса'] = p.TYPE_OF_SHELL;
    if (p.THE_DIMENSIONS_OF_THE_CASE_X || p.THE_DIMENSIONS_OF_THE_CASE_Y || p.THE_DIMENSIONS_OF_THE_CASE_Z) {
      specs['Размеры'] = [p.THE_DIMENSIONS_OF_THE_CASE_X, p.THE_DIMENSIONS_OF_THE_CASE_Y, p.THE_DIMENSIONS_OF_THE_CASE_Z].filter(Boolean).join(' × ') + ' мм';
    }
    if (p.TEMPERATURE_RANGE) {
      let t = p.TEMPERATURE_RANGE.replace(/"/g, '').trim();
      specs['Температурный диапазон'] = t;
    }
    if (p.MAXIMUM_PASSING_CURRENT) specs['Макс. ток'] = p.MAXIMUM_PASSING_CURRENT + ' А';

    products.push({
      id: id++,
      name: p.PARTNUMBER || p.IE_NAME,
      category: 'Преобразователи напряжения',
      subcategory: p.IC_GROUP0 || 'Преобразователи',
      description: p.IE_NAME || '',
      image: p.IE_PREVIEW_PICTURE ? 'https://ekb-test.ru/upload/resize_cache/uf/' + p.IE_PREVIEW_PICTURE : '',
      specs
    });
  }
}

// --- 4. СВЧ-конденсаторы (90) ---
const caps = data['СВЧ-конденсаторы'];
if (caps && caps.products) {
  for (const p of caps.products) {
    if (p.IE_ACTIVE !== 'Y') continue;
    const specs = {};
    if (p.PICOPARAD_PF) specs['Ёмкость'] = p.PICOPARAD_PF + ' пФ';
    if (p.FRAME) specs['Корпус'] = p.FRAME;
    if (p.RATED_VOLTAGE) specs['Номинальное напряжение'] = p.RATED_VOLTAGE;
    if (p.THE_RANGE_OF_OPERATING_TEMPERATURES_FROM || p.THE_RANGE_OF_OPERATING_TEMPERATURES_TO) {
      specs['Температурный диапазон'] = (p.THE_RANGE_OF_OPERATING_TEMPERATURES_FROM || '') + '…' + (p.THE_RANGE_OF_OPERATING_TEMPERATURES_TO || '') + ' °C';
    }
    if (p.ACCURACY_FROM || p.ACCURACY_TO) {
      specs['Точность'] = [p.ACCURACY_FROM, p.ACCURACY_TO].filter(Boolean).join(' … ');
    }
    if (p.TYPE) specs['Тип'] = p.TYPE;
    if (p.APPLICATION_AREA) specs['Область применения'] = p.APPLICATION_AREA;

    products.push({
      id: id++,
      name: p.PARTNUMBER || p.CODE || p.IE_NAME,
      category: 'СВЧ-конденсаторы',
      subcategory: p.IC_GROUP0 || 'СВЧ-конденсаторы',
      description: p.IE_NAME || '',
      image: p.IE_PREVIEW_PICTURE ? 'https://ekb-test.ru/upload/resize_cache/uf/' + p.IE_PREVIEW_PICTURE : '',
      specs
    });
  }
}

// --- 5. СВЧ-транзисторы (38) ---
const trans = data['Отечественные замены радиочастотных компонентов'];
if (trans && trans.products) {
  for (const p of trans.products) {
    if (p.IE_ACTIVE !== 'Y') continue;
    const specs = {};
    if (p.TYPE) specs['Тип'] = p.TYPE;
    if (p.POWER) specs['Мощность'] = p.POWER + ' Вт';
    if (p.WORK_VOLTAGE) specs['Рабочее напряжение'] = p.WORK_VOLTAGE + ' В';
    if (p.GAIN) specs['Усиление'] = p.GAIN + ' дБ';
    if (p.THE_BOUNDARY_FREQUENCY_OF_AMPLIFICATION_TO_THE_GHZ) {
      specs['Граничная частота'] = p.THE_BOUNDARY_FREQUENCY_OF_AMPLIFICATION_TO_THE_GHZ + ' ГГц';
    }
    if (p.TYPE_OF_SHELL) specs['Тип корпуса'] = p.TYPE_OF_SHELL;
    if (p.BODY_SIZE_X || p.BODY_SIZE_Y || p.BODY_SIZE_Z) {
      specs['Размеры корпуса'] = [p.BODY_SIZE_X, p.BODY_SIZE_Y, p.BODY_SIZE_Z].filter(Boolean).join(' × ') + ' мм';
    }

    products.push({
      id: id++,
      name: p.PARTNUMBER || p.IE_NAME,
      category: 'СВЧ-транзисторы',
      subcategory: p.IC_GROUP0 || 'СВЧ-транзисторы',
      description: p.IE_NAME || '',
      image: p.IE_PREVIEW_PICTURE ? 'https://ekb-test.ru/upload/resize_cache/uf/' + p.IE_PREVIEW_PICTURE : '',
      specs
    });
  }
}

// --- Output ---
const output = '// Каталог продуктов ИК Фарватер\n' +
  '// Данные из Google Spreadsheet — ' + products.length + ' продуктов, 5 категорий\n' +
  '// Сгенерировано автоматически из all_sheets.json\n\n' +
  'const PRODUCTS = ' + JSON.stringify(products, null, 2) + ';\n';

const outPath = path.join(__dirname, '..', 'site', 'demo project', 'ic farvater', 'js', 'products.js');
fs.writeFileSync(outPath, output, 'utf8');

// Stats
const cats = {};
for (const p of products) {
  cats[p.category] = (cats[p.category] || 0) + 1;
}
console.log('Total products:', products.length);
console.log('By category:', cats);
