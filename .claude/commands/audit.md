# Audit — Design State Audit

Аудит текущего состояния (Pencil frame или HTML page) против IC final design system. Применяется к: $ARGUMENTS

---

## Шаг 1 — Read Audit Rules

- `D:/site/docs/design-research/20-ic-final-design-system-2026-05-16.md` § 12 Pre-Build Checklist
- `D:/site/CLAUDE.md`
- Memory: `errors_log.md`

## Шаг 2 — Get Current State

Если Pencil:
- `mcp__pencil__snapshot_layout` (parentId, maxDepth 2)
- `mcp__pencil__get_screenshot` (parent frame)
- `mcp__pencil__batch_get` (readDepth 2) для inspection

Если HTML:
- Read all relevant CSS/HTML files
- Identify computed properties

## Шаг 3 — Run Audit Checks

**Color discipline:**
- [ ] Только tokens из `--color-*` (никаких arbitrary hex)
- [ ] Один accent (`#112F6E`), no second
- [ ] Off-black through `#112F6E`, не `#000`

**Typography:**
- [ ] Inter Tight 400/500/600 only
- [ ] Letter-spacing per § 2 table
- [ ] Case strategy (UPPERCASE labels + lowercase headlines + sentence body)
- [ ] No italic
- [ ] Body max-width 380px / 40ch
- [ ] Line-height 1.55 body, 1.0-1.1 display

**Grid:**
- [ ] Container 1320 content + 60 side padding = 1440 viewport
- [ ] Section padding 80 / 60 / 56 standard, 120 drenched
- [ ] 2-variant cards 312×420 + 312×198 only
- [ ] Sparse Row1 (2 cards) + Row2 (3 cards)

**Anti-patterns (банов):**
- [ ] No 4-equal cards filled
- [ ] No box-shadow
- [ ] No border-radius на cards (только pill buttons)
- [ ] No filled coloured CTA other than `#112F6E`
- [ ] No `(NN)` round counters (только `[NN]`)
- [ ] No heart icon (replace с `+ в подборку`)
- [ ] No exclamation marks в copy
- [ ] No "elevate/unleash/seamless" cliches
- [ ] No 3-col headers (только 2-col)
- [ ] No italic accent words (no Inter italic)

**Copy:**
- [ ] Hero 3-6 words, 2-3 lines max (or 4-line staircase)
- [ ] Period at end of micro-captions
- [ ] En-dash в SKU codes `ЕТ–СНЦ23`
- [ ] CTA labels 1-3 words + arrow

**Mobile:**
- [ ] Hero scales 168→131→94 (or similar 0.78/0.56 ratio)
- [ ] Cards stack 1-col на mobile
- [ ] Touch targets ≥44×44
- [ ] Burger trigger ≤1024

## Шаг 4 — Report

Output: list of violations found + priority (HIGH / MEDIUM / LOW) + recommended fixes.

---

**Target:** $ARGUMENTS
