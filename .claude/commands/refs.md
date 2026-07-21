# Refs — Reference Audit Workflow

Универсальный skill для аудита design references. Project-agnostic — работает с любым brand reference.

**Использует:**
- [`docs/design-research/_REFERENCE-TEMPLATE.md`](../../docs/design-research/_REFERENCE-TEMPLATE.md) — 15-секционный canonical DESIGN.md формат
- [`docs/design-research/_VERIFICATION-PROTOCOL.md`](../../docs/design-research/_VERIFICATION-PROTOCOL.md) — zero-hallucination правила
- [`docs/design-research/refs/_BACKLOG.md`](../../docs/design-research/refs/_BACKLOG.md) — список pending refs

**Аргументы:** `$ARGUMENTS`
- `<url>` — извлечь DESIGN.md из URL (strict verification через Playwright)
- `<ref-id>` — показать existing ref (например `15-custo`, `07-te`, `30-good-life`)
- `<ref-id> --rewrite` — refactor old descriptive audit to canonical format
- `<ref-id> --apply <project>` — generate project application notes
- `list` — показать backlog
- `<section-type>` (hero / store / faq / footer) — показать релевантные refs

---

## Метод аудита (DESIGN.md format)

Хороший reference audit имеет 3 уровня:

```
refs/<NN-slug>/
├── canonical.md       ← Observations (verified tokens, components, do/don't)
├── extended.md        ← Interpretation (TL;DR, ASCII, voice, mix wisdom)
└── projects/
    └── x-<project>.md ← Application (как применить к конкретному проекту)
```

**Правило разделения:**
- `canonical.md` — что **фактически** на странице
- `extended.md` — что мы **думаем** про это
- `projects/x-<proj>.md` — как **применить**

---

## Workflow

### Step 1 — Determine mode

Из `$ARGUMENTS`:
- URL → **Strict audit mode** (Step 2A)
- `<ref-id>` → **Show mode** (Step 4)
- `<ref-id> --rewrite` → **Refactor mode** (Step 2B)
- `<ref-id> --apply <project>` → **Apply mode** (Step 5)
- `list` → cat `refs/_BACKLOG.md`

### Step 2A — Strict audit via Playwright (preferred)

1. **Load Playwright tools:** ToolSearch `mcp__playwright__browser_navigate`, `browser_evaluate`, `browser_close`
2. **Navigate** to URL: `browser_navigate({url})`
3. **Extract computed styles** via `browser_evaluate`:
   ```js
   () => {
     const result = { title: document.title };
     // body / html
     result.body = { bg, color, fontFamily, fontSize, lineHeight };
     // headings
     ['h1','h2','h3','p','button','a'].forEach(tag => {
       const el = document.querySelector(tag);
       if (el) {
         const s = getComputedStyle(el);
         result[tag] = { text, fontFamily, fontSize, fontWeight, lineHeight, letterSpacing, color, bg, textTransform, padding, borderRadius };
       }
     });
     // unique colors
     const bgs = new Set(); const txts = new Set();
     document.querySelectorAll('*').forEach(el => {
       const bg = getComputedStyle(el).backgroundColor;
       if (bg && bg !== 'rgba(0, 0, 0, 0)') bgs.add(bg);
     });
     result.bgs = Array.from(bgs).slice(0, 10);
     result.txts = Array.from(txts).slice(0, 10);
     return result;
   }
   ```
4. **Close browser:** `browser_close()`
5. **Write 3 files** в `refs/<NN-slug>/` per `_REFERENCE-TEMPLATE.md`:
   - `canonical.md` — verified tokens из computed styles
   - `extended.md` — TL;DR, mix wisdom (optional, compact)
   - `projects/x-<active-project>.md` — application notes (if project context known)
6. **Mark verification level: strict** в footer canonical.md
7. **Update** `refs/_BACKLOG.md` — mark as done

### Step 2B — Refactor mode (old descriptive → canonical)

1. **Read old ref file:** `docs/design-research/<NN>-reference-<slug>.md`
2. **Check for screenshots:** `D:\Загрузки\руфы\` (если есть)
3. **If live URL available:** prefer strict re-audit via Step 2A
4. **If screenshot only:** visual extraction с `~estimate` пометками
5. **Write 3 files** в new structure
6. **Mark verification level** appropriately:
   - `strict` — Playwright getComputedStyle
   - `partial` — multiple screenshots + WhatTheFont
   - `screenshot-only` — single screenshot visual estimate

### Step 4 — Show mode

```
Read refs/<NN-slug>/canonical.md (always exists if ref is refactored)
Show core sections (Tokens, Components, Do/Don't)
Note verification level и reliability
```

### Step 5 — Apply mode (project-specific)

1. Read `refs/<NN-slug>/canonical.md`
2. Read project context (`CLAUDE.md` or project README)
3. Generate `refs/<NN-slug>/projects/x-<project>.md`:
   - Compatibility check table
   - Translatable elements (HIGH/MEDIUM/SKIP)
   - NOT translatable (with reasons)
   - Mix wisdom для project
   - Action items

---

## Verification protocol (key rules)

**Use Playwright when URL available:**
- Computed font-family → verified font name
- Computed color → exact hex
- Computed padding/margin → exact spacing
- Computed border-radius → exact radius

**Use screenshot only когда URL недоступен:**
- Mark every numeric value with `~`
- Don't multi-guess font names ("вероятно X / Y / Z")
- Don't claim numeric weight ("heavy" without verified 800)

**Never do (anti-hallucination):**
- ✗ Multi-guess fonts ("Söhne / GT America / Untitled Sans")
- ✗ Approximate hex without color picker / computed style
- ✗ "Heavy" / "Medium" / "Bold" without numeric weight
- ✗ Project mixing внутри canonical (use `projects/` folder)
- ✗ Universal claims из single page observation

---

## Common audit anti-patterns (from prior errors)

1. **Font name multi-guess** — pick one verified font, не три варианта
2. **Adjective weights** — указать numeric (400 / 500 / 600), не "heavy"
3. **Off-by-luminance hex** — verify через computed style или color picker
4. **Project mixing in reference** — keep project notes в `projects/` only
5. **Behance vs production confusion** — Behance case studies могут добавлять wrapper elements (status bar, marginalia) не существующие на реальном сайте

---

## Existing refs (current state)

См. `docs/design-research/refs/_BACKLOG.md` для актуального списка.

**Done (canonical/extended/projects structure):**
- `07-te` (Teenage Engineering) — screenshot-only
- `08-re-grocery` — **strict** (Playwright)
- `09-on-running` — screenshot-only
- `11-vonda` — screenshot-only
- `15-custo` — strict (from canonical DESIGN.md)
- `23-topicals` — screenshot-only (4 captures)
- `24-moss` — screenshot-only
- `26-hello-klean` — screenshot-only
- `27-cenee` — screenshot-only
- `28-apple-watch` — screenshot-only
- `29-seed` — screenshot-only
- `30-good-life` — screenshot-only
- `31-nfinite` — screenshot-only
- `32-arsenij-fabrica` — **strict** (Playwright)
- `33-isla-beauty` — **strict** (Playwright)
- `34-glossier` — **strict** (Playwright)
- `35-twotwo` — **strict** (Playwright)
- `36-phipps-charlie` — **strict** (Playwright)

**Old descriptive (not yet refactored):**
- `12-reference-flip-mode-brew.md`
- `13-reference-noden.md`
- `14-reference-aytm.md`
- `16-reference-es-studio.md`
- `17-reference-ad-studio.md`
- `22-reference-gs-arts-center.md`

---

## Quick examples

**Strict audit new URL:**
```
/refs https://example.com
```

**Show existing ref:**
```
/refs 30-good-life
```

**Generate application notes:**
```
/refs 30-good-life --apply ic-farvater
```

**List backlog:**
```
/refs list
```

**Show refs for specific section type:**
```
/refs hero       # show all refs with notable hero patterns
/refs faq        # show all refs with FAQ patterns (Topicals / Nfinite / MOSS / Good Life)
/refs store      # show catalog grid patterns
/refs footer     # show footer architectures
```

---

**Created:** 2026-05-20 (universal refactor — project-agnostic)
**Replaces:** previous IC-specific `/refs` workflow
