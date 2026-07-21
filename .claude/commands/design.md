# Design — Universal Design Skill

Универсальный design skill основанный на **DESIGN.md-методе**. Project-agnostic — работает с любым проектом (IC Farvater / SOVA / новый проект).

**Аргументы:** `$ARGUMENTS` (описание дизайн-задачи)

---

## Метод

Хороший дизайн = **closed system** из 3 уровней:

```
1. Tokens         (закрытый набор: colors, type scale, spacing)
2. Components     (готовые рецепты с полной спекой и Role)
3. Rules          (Do/Don't guardrails)
```

Когда все три уровня согласованы — дизайн исполняется однозначно. Это и есть **DESIGN.md format** (см. `docs/design-research/_REFERENCE-TEMPLATE.md`).

---

## Workflow

### Step 1 — Determine project context

Если есть `CLAUDE.md` в working directory:
- Read project rules (palette / typography / spacing / image rules)
- Identify project-specific design system file (например `docs/design-research/IC-DESIGN-SYSTEM.md` для IC)
- Treat project spec as **target tokens** для new design

Если нет CLAUDE.md:
- Treat as new project
- Ask user: какие brand references влияют? какая палитра? какой проект (B2B / B2C / portfolio)?

### Step 2 — Identify relevant references

Из `docs/design-research/refs/_BACKLOG.md` найти **2-3 refs** релевантных задаче. Например:
- Hero design → TE multi-anchor / AD STUDIO 50/50 / Nfinite drenched / Topicals bookended
- B2B technical → Nfinite / Custo / Good Life
- E-commerce catalog → Topicals 4-col / On Running uniform / TE asymmetric
- FAQ → Topicals sidebar+accordion / Nfinite right-panel / MOSS side-by-side / Good Life
- Trust badges → Cénée 4-col cert strip / Good Life 4-col / TE bracketed
- Footer → Hello Klean cropped wordmark / Topicals bookended / Nfinite subscribe

**Read** `refs/<NN-slug>/canonical.md` для каждого выбранного ref.

### Step 3 — Activate design skills (parallel)

Запустить релевантные skill tools одним сообщением:

- `impeccable` — complex design / redesign / audit / UI hierarchy
- `minimalist-skill` — Swiss editorial / cream palette / hairlines
- `soft-skill` — premium agency feel (typography / shadows / cards)
- `taste-skill` — Senior UI/UX metric rules
- `redesign-skill` — audit generic patterns
- `ui-refactor` — tactical fixes (layout / colors / hierarchy / typography)
- `stitch-skill` — semantic design system / asymmetric layouts
- `output-skill` — full output без обрезаний

Add domain-specific skills based на task:
- `brandkit` — brand identity / logo systems
- `imagegen-frontend-web` — section image generation
- `motion-framer` — animation / interactive UI
- `blender-pro` — 3D / product render

### Step 4 — UI/UX Pro Max search (optional)

Если задача требует database lookup:

```bash
python "<UI_UX_PRO_MAX_PATH>/scripts/search.py" "<query>" --domain <style|color|typography|landing|ux|product|chart>
```

Path varies per project. Для IC Farvater: `D:\site\.claude\skills\ui-ux-pro-max-skill\src\ui-ux-pro-max\scripts\search.py`

### Step 5 — Apply DESIGN.md method to task

Build solution layer-by-layer:

**1. Tokens — Colors**
- Identify palette из project spec (`CLAUDE.md` / `IC-DESIGN-SYSTEM.md`)
- Single source of truth — не выдумывать новые цвета
- 5-7 цветов с явными ролями

**2. Tokens — Typography**
- Single или dual typeface (за reference патерн)
- 3-5 sizes max в type scale
- Single или dual weight strategy (Custo = 1 / IC = 2 / Apple = many)

**3. Tokens — Spacing**
- Closed set (project spec defines)
- Base unit + density declaration
- Section padding standard / drenched / mobile

**4. Components — recipes с Role**
- Каждый component с явной `Role:` строкой
- bg / border / text / padding / radius / typography spec
- 5-8 рецептов основных компонентов

**5. Do's and Don'ts — guardrails**
- 5+ Do (positive rules)
- 5+ Don't (anti-patterns from project history + reference anti-patterns)

**6. Apply tokens** to building blocks:
- Hero (per chosen archetype)
- Section header
- Cards / grid
- Footer
- Navigation

### Step 6 — Build

Two paths:

**A. Pencil (if .pen file involved):**
- `mcp__pencil__get_editor_state` (include_schema:true first time)
- `mcp__pencil__batch_get` — existing components
- `mcp__pencil__find_empty_space_on_canvas` — место для новых вариантов
- `mcp__pencil__batch_design` — assembly
- `mcp__pencil__get_screenshot` — verification

**B. HTML/CSS:**
- Edit existing CSS variables / files
- Maintain project conventions (BEM / file structure / cache versioning)
- Test responsive (desktop / tablet / mobile)

### Step 7 — Verify

Always verify against:

1. **Project spec** (CLAUDE.md / IC-DESIGN-SYSTEM.md) — no token violations
2. **Reference canonicals** — patterns applied correctly
3. **Anti-patterns checklist** — no forbidden elements (shadows / wrong radius / wrong colors)
4. **Visual** — screenshot Pencil frame OR browser test HTML
5. **Mobile** — verify breakpoints scale per project spec

---

## Hard constraints (universal — project-agnostic)

Apply unless project spec overrides:

- **Closed token sets** — не выдумывать значений вне established scale
- **Single source of truth** — palette / typography defined ONCE в project spec, referenced везде
- **Role-driven components** — каждый component имеет one-line Role описание
- **Verifiable extractions** — все token values trace to project spec, не к "приблизительно"
- **Anti-hallucination** — не описывать "выглядит heavy" если weight не verified

---

## Project-specific constraints

При работе над IC Farvater:

- Read `CLAUDE.md` для типографики, цвета, spacing rules
- Read `docs/design-research/refs/<ref>/projects/x-ic.md` для application notes если ref используется
- Read memory `project_ic_final_pattern.md` для current FINAL pattern
- Read memory `variation_playbook.md` для archetype variations
- Read memory `errors_log.md` для known IC anti-patterns

При работе над SOVA или другим проектом:

- Read `<project>/CLAUDE.md` если есть
- Identify which refs are translatable for that project context
- Generate `refs/<NN>/projects/x-<project>.md` если ещё нет

---

## Quick examples

**Design new hero for IC product detail page:**
```
/design hero для product detail page ЕТ-СНЦ23
```
→ Read IC spec → Identify relevant refs (TE multi-anchor + Nfinite stat) → Apply method → Build в Pencil

**Redesign existing section:**
```
/design redesign products grid с editorial spans (как VONDA)
```
→ Read VONDA canonical + IC spec → Identify compatible spans → Build alternative grid layout

**New project from scratch:**
```
/design landing page для нового SaaS B2B (industrial materials)
```
→ Ask user about palette / brand voice → Read Nfinite + Cénée canonicals → Establish project tokens → Build

---

## Skill loadout (canonical default)

For most design tasks, load these in parallel as Step 3:

```
Skills: impeccable, minimalist-skill, soft-skill, taste-skill, ui-refactor, output-skill
```

Add as needed:
- `stitch-skill` — for complex asymmetric layouts
- `brandkit` — for identity / logo work
- `imagegen-frontend-web` — for section image generation

---

## Anti-patterns (what makes design generic / bad)

From accumulated `errors_log` (project-agnostic):

1. ✗ Multi-color accent system без commitment (use 1-2 max)
2. ✗ Weight variation as substitute для typography hierarchy
3. ✗ Random spacing values не from established scale
4. ✗ Bright commercial photography в restrained brand context
5. ✗ Hover transforms (`scale(1.05)`) если brand commits flat
6. ✗ Border-radius mix (0 / 4 / 8 / 16 / 100) without coherent system
7. ✗ Marketing cliches ("revolutionary", "next-gen", "elevate")
8. ✗ Stock photography везде
9. ✗ Universal UPPERCASE без reason
10. ✗ Multi-guess font names ("вероятно X / Y / Z")

---

## Output expectations

End of `/design` workflow always produces:

- **Concrete tokens used** (from project spec or established refs)
- **Components built** (Pencil frames OR HTML/CSS files)
- **Verification done** (snapshot + screenshot OR browser test)
- **Notes captured** (what was applied / what was skipped / why)

If working on memory-tracked project:
- Update `positive_feedback_log` if pattern works
- Update `errors_log` if pattern fails

---

**Task:** $ARGUMENTS

**Created:** 2026-05-20 (universal refactor — project-agnostic)
**Replaces:** previous IC-specific `/design` workflow
**Cross-references:** [`/refs`](refs.md), [`/audit`](audit.md), [`/check`](check.md), [`/iterate`](iterate.md), [`/apply`](apply.md)
