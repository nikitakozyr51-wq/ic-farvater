#!/usr/bin/env node
/**
 * UI/UX Pro Max Search — Node.js port
 * Usage: node search.mjs "<query>" --domain <domain> [-n <max_results>]
 * Domains: product, style, typography, color, landing, chart, ux
 */
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dataDir = join(__dirname, '..', 'data');

const DOMAIN_MAP = {
  product: 'products.csv',
  style: 'styles.csv',
  typography: 'typography.csv',
  color: 'colors.csv',
  landing: 'landing.csv',
  chart: 'charts.csv',
  ux: 'ux.csv',
};

function parseCSV(text) {
  const lines = text.split('\n').filter(l => l.trim());
  if (lines.length < 2) return [];
  const headers = parseCSVLine(lines[0]);
  return lines.slice(1).map(line => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => obj[h.trim()] = (values[i] || '').trim());
    return obj;
  });
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') { current += '"'; i++; }
      else inQuotes = !inQuotes;
    } else if (ch === ',' && !inQuotes) {
      result.push(current); current = '';
    } else {
      current += ch;
    }
  }
  result.push(current);
  return result;
}

/** Simple BM25-like scoring */
function score(query, doc) {
  const terms = query.toLowerCase().split(/\s+/);
  const text = Object.values(doc).join(' ').toLowerCase();
  let s = 0;
  for (const term of terms) {
    const regex = new RegExp(term, 'gi');
    const matches = text.match(regex);
    if (matches) s += matches.length * (1 / (1 + Math.log(text.length / 100)));
  }
  return s;
}

// Parse args
const args = process.argv.slice(2);
let query = '', domain = '', maxResults = 10;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--domain' && args[i + 1]) { domain = args[++i]; }
  else if (args[i] === '-n' && args[i + 1]) { maxResults = parseInt(args[++i]); }
  else if (!args[i].startsWith('-')) { query += (query ? ' ' : '') + args[i]; }
}

if (!query) {
  console.log('Usage: node search.mjs "<query>" --domain <domain> [-n <max_results>]');
  console.log('Domains:', Object.keys(DOMAIN_MAP).join(', '));
  process.exit(1);
}

// Auto-detect domain if not specified
if (!domain) {
  const q = query.toLowerCase();
  if (q.match(/color|palette|theme/)) domain = 'color';
  else if (q.match(/font|typo|heading/)) domain = 'typography';
  else if (q.match(/style|design|morph|minimal/)) domain = 'style';
  else if (q.match(/landing|hero|cta|page/)) domain = 'landing';
  else if (q.match(/chart|graph|visual/)) domain = 'chart';
  else if (q.match(/ux|user|experience|pattern/)) domain = 'ux';
  else domain = 'product';
}

const file = DOMAIN_MAP[domain];
if (!file) {
  console.error(`Unknown domain: ${domain}. Available: ${Object.keys(DOMAIN_MAP).join(', ')}`);
  process.exit(1);
}

try {
  const csv = readFileSync(join(dataDir, file), 'utf-8');
  const rows = parseCSV(csv);
  const scored = rows.map(r => ({ ...r, _score: score(query, r) }))
    .filter(r => r._score > 0)
    .sort((a, b) => b._score - a._score)
    .slice(0, maxResults);

  if (scored.length === 0) {
    console.log(`No results for "${query}" in domain "${domain}".`);
    console.log('Try a different query or domain.');
  } else {
    console.log(`\n=== ${domain.toUpperCase()} results for "${query}" (${scored.length} matches) ===\n`);
    scored.forEach((r, i) => {
      const { _score, ...data } = r;
      console.log(`--- Result ${i + 1} (score: ${_score.toFixed(2)}) ---`);
      for (const [k, v] of Object.entries(data)) {
        if (v) console.log(`  ${k}: ${v.substring(0, 200)}`);
      }
      console.log('');
    });
  }
} catch (e) {
  console.error(`Error reading ${file}: ${e.message}`);
  process.exit(1);
}
