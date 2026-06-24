# Ebook PAI3 Foundation and Module 1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Convert the current ebook into a reproducible, validated editorial project and deliver a complete, source-backed, print-ready reconstruction of Module 1.

**Architecture:** Keep `ebook-muestra.html` as the assembled artifact that the user opens and converts to PDF, but move editable content into focused source files under `ebook/`. A dependency-free Node.js builder will assemble the cover, shared styles, and seven module fragments; validators will enforce curricular coverage, source metadata, link integrity, image accessibility, and print structure. This first plan preserves Modules 2–7 as-is while replacing Module 1 and establishing the pattern later plans will follow.

**Tech Stack:** HTML5, print CSS, SVG, Node.js ESM, built-in `node:test`, Playwright CLI/Chromium for rendering and PDF export, Markdown for curriculum and research records.

---

## Scope boundary

This plan implements:

- The editable ebook source structure.
- A deterministic build and validation process.
- A curricular coverage matrix for all seven modules.
- A research and source ledger for Module 1.
- The complete editorial, pedagogical, and visual reconstruction of Module 1.
- Integral and Module 1 PDF verification.

This plan does not rewrite Modules 2–7. Their current HTML is migrated unchanged into source fragments so the integral ebook remains buildable. Each later module receives its own implementation plan.

## Target file structure

```text
ebook/
├── README.md
├── curriculum-matrix.md
├── template/
│   ├── document-start.html
│   ├── document-end.html
│   ├── ebook.css
│   ├── cover.html
│   └── toc.html
├── modules/
│   ├── module-01.html
│   ├── module-02.html
│   ├── module-03.html
│   ├── module-04.html
│   ├── module-05.html
│   ├── module-06.html
│   └── module-07.html
├── references/
│   └── module-01-sources.md
└── assets/
    └── module-01/
        ├── interaction-cycle.svg
        ├── tv-evolution-timeline.svg
        ├── standards-map.svg
        ├── isdbt-ginga-pipeline.svg
        ├── devendra-flow.svg
        └── platform-comparison.svg
scripts/
├── build-ebook.mjs
├── validate-ebook.mjs
└── export-ebook.mjs
tests/
├── ebook-build.test.mjs
└── ebook-module01.test.mjs
package.json
ebook-muestra.html
PAI3_ebook.pdf
PAI3_M01_Interactividad_TV.pdf
```

Generated HTML and PDFs remain at the root because that is the user's current
workflow. Files under `ebook/` are the editable source of truth.

---

### Task 1: Protect local artifacts and document the source-of-truth contract

**Files:**
- Modify: `.gitignore`
- Create: `ebook/README.md`
- Create: `package.json`

- [ ] **Step 1: Ignore the visual brainstorming workspace**

Append this exact entry to `.gitignore`:

```gitignore
# Temporary visual brainstorming companion
.superpowers/
```

Do not ignore `ebook-muestra.html` or the PDFs in this task; the user decides
later whether generated deliverables belong in Git.

- [ ] **Step 2: Document the editorial workflow**

Create `ebook/README.md`:

```markdown
# Ebook PAI3

`ebook/` contains the editable source of the PAI3 ebook.

## Source of truth

- Shared layout and print styles: `template/`
- One editable HTML fragment per module: `modules/`
- Curricular traceability: `curriculum-matrix.md`
- Research and citations: `references/`
- Didactic figures: `assets/`

Do not edit `ebook-muestra.html` directly. Generate it with:

```powershell
npm run ebook:build
```

Validate the result with:

```powershell
npm run ebook:check
```

Export the integral ebook and Module 1 PDFs with:

```powershell
npm run ebook:pdf
```
```

- [ ] **Step 3: Add dependency-free project scripts**

Create `package.json`:

```json
{
  "name": "ubp-pai3",
  "private": true,
  "type": "module",
  "scripts": {
    "test": "node --test tests/*.test.mjs",
    "ebook:build": "node scripts/build-ebook.mjs",
    "ebook:check": "node scripts/validate-ebook.mjs",
    "ebook:pdf": "node scripts/export-ebook.mjs"
  }
}
```

- [ ] **Step 4: Verify the package scripts are discoverable**

Run:

```powershell
npm run
```

Expected: output lists `test`, `ebook:build`, `ebook:check`, and `ebook:pdf`.

- [ ] **Step 5: Commit the workflow contract**

```powershell
git add .gitignore package.json ebook/README.md
git commit -m "chore: define ebook source workflow"
```

---

### Task 2: Split the existing monolith into stable source fragments

**Files:**
- Create: `ebook/template/document-start.html`
- Create: `ebook/template/document-end.html`
- Create: `ebook/template/ebook.css`
- Create: `ebook/template/cover.html`
- Create: `ebook/template/toc.html`
- Create: `ebook/modules/module-01.html`
- Create: `ebook/modules/module-02.html`
- Create: `ebook/modules/module-03.html`
- Create: `ebook/modules/module-04.html`
- Create: `ebook/modules/module-05.html`
- Create: `ebook/modules/module-06.html`
- Create: `ebook/modules/module-07.html`
- Test: `tests/ebook-build.test.mjs`

- [ ] **Step 1: Write the failing source-structure test**

Create `tests/ebook-build.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";

const modules = Array.from(
  { length: 7 },
  (_, index) => `ebook/modules/module-${String(index + 1).padStart(2, "0")}.html`
);

test("ebook source contains seven module fragments", async () => {
  await Promise.all(modules.map((file) => access(file)));
});

test("each module exposes a stable module id", async () => {
  for (const [index, file] of modules.entries()) {
    const html = await readFile(file, "utf8");
    assert.match(html, new RegExp(`data-module="${index + 1}"`));
  }
});

test("shared template files exist", async () => {
  await Promise.all([
    "ebook/template/document-start.html",
    "ebook/template/document-end.html",
    "ebook/template/ebook.css",
    "ebook/template/cover.html",
    "ebook/template/toc.html"
  ].map((file) => access(file)));
});
```

- [ ] **Step 2: Run the test and confirm it fails**

Run:

```powershell
npm test
```

Expected: FAIL because the `ebook/template/` and `ebook/modules/` files do not
exist.

- [ ] **Step 3: Extract shared layout without editorial changes**

Move the current document declaration, `<head>` metadata, and opening `<body>`
markup into `ebook/template/document-start.html`. Replace the inline style body
with:

```html
<style>
/* {{EBOOK_CSS}} */
</style>
</head>
<body>
<main class="page ebook" id="ebook">
```

Move the full current `<style>` contents into `ebook/template/ebook.css`.

Create `ebook/template/document-end.html`:

```html
</main>
</body>
</html>
```

Move the current cover into `ebook/template/cover.html` and the current table of
contents into `ebook/template/toc.html`.

- [ ] **Step 4: Extract the seven modules using the existing marker boundaries**

Use the comments already present in `ebook-muestra.html`:

```html
<!-- OPENER M1 -->
<!-- ════════ MÓDULO 02 ════════ -->
```

and the equivalent module comments to create one fragment per module. Wrap each
fragment in a stable boundary:

```html
<article class="ebook-module" data-module="1" id="module-1">
  <!-- existing opener and body for Module 1 -->
</article>
```

Repeat through `data-module="7"`. Do not rewrite prose, links, image data, or
styles during this extraction.

- [ ] **Step 5: Run the source-structure test**

Run:

```powershell
npm test
```

Expected: PASS for all three tests.

- [ ] **Step 6: Commit the mechanical extraction**

```powershell
git add ebook/template ebook/modules tests/ebook-build.test.mjs
git commit -m "refactor: split ebook into editable source fragments"
```

---

### Task 3: Build the integral and individual ebook HTML deterministically

**Files:**
- Create: `scripts/build-ebook.mjs`
- Modify: `tests/ebook-build.test.mjs`
- Generate: `ebook-muestra.html`
- Generate: `.tmp/ebook-module-01.html`

- [ ] **Step 1: Add failing build assertions**

Append to `tests/ebook-build.test.mjs`:

```js
import { rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";

test("builder produces integral and Module 1 HTML", async () => {
  await rm("ebook-muestra.html", { force: true });
  await rm(".tmp/ebook-module-01.html", { force: true });

  const result = spawnSync(process.execPath, ["scripts/build-ebook.mjs"], {
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr);

  const integral = await readFile("ebook-muestra.html", "utf8");
  const moduleOne = await readFile(".tmp/ebook-module-01.html", "utf8");

  assert.equal((integral.match(/class="ebook-module"/g) ?? []).length, 7);
  assert.equal((moduleOne.match(/class="ebook-module"/g) ?? []).length, 1);
  assert.match(integral, /Programación para Ambientes Interactivos III/);
});
```

- [ ] **Step 2: Run the new test and confirm it fails**

Run:

```powershell
npm test
```

Expected: FAIL because `scripts/build-ebook.mjs` does not exist.

- [ ] **Step 3: Implement the deterministic builder**

Create `scripts/build-ebook.mjs`:

```js
import { mkdir, readFile, writeFile } from "node:fs/promises";

const read = (path) => readFile(path, "utf8");
const modulePath = (number) =>
  `ebook/modules/module-${String(number).padStart(2, "0")}.html`;

const [start, end, css, cover, toc] = await Promise.all([
  read("ebook/template/document-start.html"),
  read("ebook/template/document-end.html"),
  read("ebook/template/ebook.css"),
  read("ebook/template/cover.html"),
  read("ebook/template/toc.html")
]);

const modules = await Promise.all(
  Array.from({ length: 7 }, (_, index) => read(modulePath(index + 1)))
);

const shell = (content, title) =>
  start
    .replace("{{EBOOK_CSS}}", css)
    .replace("{{DOCUMENT_TITLE}}", title)
    .concat(content, end);

const integral = shell(
  [cover, toc, ...modules].join("\n"),
  "PAI3 · Ebook completo"
);

await mkdir(".tmp", { recursive: true });
await writeFile("ebook-muestra.html", integral, "utf8");
await writeFile(
  ".tmp/ebook-module-01.html",
  shell(modules[0], "PAI3 · Módulo 1 · Interactividad y TV Digital"),
  "utf8"
);

console.log("Built ebook-muestra.html and .tmp/ebook-module-01.html");
```

Ensure `ebook/template/document-start.html` contains
`<title>{{DOCUMENT_TITLE}}</title>`.

- [ ] **Step 4: Run tests and inspect deterministic output**

Run:

```powershell
npm test
npm run ebook:build
```

Expected: all tests PASS and the builder reports both output files.

- [ ] **Step 5: Confirm the extraction did not lose module boundaries**

Run:

```powershell
$html = Get-Content -Raw ebook-muestra.html
([regex]::Matches($html, 'class="ebook-module"')).Count
```

Expected: `7`.

- [ ] **Step 6: Commit the builder**

```powershell
git add scripts/build-ebook.mjs tests/ebook-build.test.mjs ebook-muestra.html
git commit -m "build: generate integral and module ebook html"
```

---

### Task 4: Create curricular traceability and automated content validation

**Files:**
- Create: `ebook/curriculum-matrix.md`
- Create: `scripts/validate-ebook.mjs`
- Create: `tests/ebook-module01.test.mjs`
- Modify: `package.json`

- [ ] **Step 1: Write the curriculum matrix with explicit status labels**

Create `ebook/curriculum-matrix.md` with this table header:

```markdown
# Matriz curricular del ebook PAI3

Estados:

- `OBLIGATORIO`: aparece en el programa formal.
- `PRERREQUISITO`: se necesita para comprender un tema obligatorio.
- `PROFUNDIZACIÓN`: amplía límites, contexto o implementación.
- `CASO`: aplica el concepto en una situación real.

| Módulo | Tipo | Tema | Sección fuente | Estado inicial |
|---|---|---|---|---|
| 1 | OBLIGATORIO | Interactividad | `#m1-interactividad` | cubierto |
| 1 | OBLIGATORIO | Niveles de interactividad | `#m1-niveles` | cubierto |
| 1 | OBLIGATORIO | Aplicaciones para TV digital | `#m1-tv-digital` | cubierto |
| 1 | OBLIGATORIO | Caso DEVENDRA | `#m1-devendra` | cubierto |
| 1 | OBLIGATORIO | Netflix, Flow y DIRECTV Play | `#m1-plataformas` | cubierto |
| 1 | PRERREQUISITO | Acción, procesamiento y feedback | `#m1-ciclo` | cubierto |
| 1 | PROFUNDIZACIÓN | Estándares, middleware, Ginga, NCL y Lua | `#m1-ginga` | cubierto |
```

Continue the table for Modules 2–7 using section 3.4 of the approved design
specification. For Modules 2–7, record the current section id and use
`parcial` or `faltante` honestly; do not mark a topic covered merely because its
name appears once.

- [ ] **Step 2: Write failing Module 1 contract tests**

Create `tests/ebook-module01.test.mjs`:

```js
import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const html = await readFile("ebook/modules/module-01.html", "utf8");

const requiredSections = [
  "m1-interactividad",
  "m1-ciclo",
  "m1-niveles",
  "m1-tv-digital",
  "m1-ginga",
  "m1-devendra",
  "m1-plataformas",
  "m1-sintesis",
  "m1-preguntas",
  "m1-glosario",
  "m1-videos",
  "m1-bibliografia",
  "m1-puente"
];

test("Module 1 contains every required pedagogical section", () => {
  for (const id of requiredSections) {
    assert.match(html, new RegExp(`id="${id}"`), `Missing #${id}`);
  }
});

test("Module 1 has no graded activity or delivery rubric", () => {
  assert.doesNotMatch(html, /actividad calificad|entregable|rúbrica de evaluación/i);
});

test("Module 1 images are local and accessible", () => {
  assert.doesNotMatch(html, /src="data:image/);
  const images = [...html.matchAll(/<img\b[^>]*>/g)].map(([tag]) => tag);
  assert.ok(images.length >= 6);
  for (const tag of images) {
    assert.match(tag, /\balt="[^"]+"/);
    assert.match(tag, /\b(?:width|height)="\d+"/);
  }
});

test("Module 1 includes source-backed bibliography", () => {
  assert.match(html, /<ol class="bibliography">/);
  assert.ok((html.match(/class="bib-entry"/g) ?? []).length >= 8);
});
```

- [ ] **Step 3: Run tests and confirm the Module 1 contract fails**

Run:

```powershell
npm test
```

Expected: existing build tests PASS; Module 1 contract tests FAIL because the
new section ids, local assets, and bibliography are not implemented yet.

- [ ] **Step 4: Implement the general HTML validator**

Create `scripts/validate-ebook.mjs`:

```js
import { access, readFile } from "node:fs/promises";

const files = [
  "ebook-muestra.html",
  ...Array.from(
    { length: 7 },
    (_, index) => `ebook/modules/module-${String(index + 1).padStart(2, "0")}.html`
  )
];

const failures = [];

for (const file of files) {
  const html = await readFile(file, "utf8");

  if (/href="#"/.test(html)) failures.push(`${file}: empty internal link`);
  if (/<img\b(?![^>]*\balt=)[^>]*>/i.test(html)) {
    failures.push(`${file}: image without alt`);
  }

  for (const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    const target = match[1];
    if (/^(https?:|mailto:|#|data:)/.test(target)) continue;
    const localPath = target.replace(/^\.\//, "ebook/");
    try {
      await access(localPath);
    } catch {
      failures.push(`${file}: missing local resource ${target}`);
    }
  }
}

if (failures.length) {
  console.error(failures.join("\n"));
  process.exit(1);
}

console.log(`Validated ${files.length} ebook HTML files`);
```

- [ ] **Step 5: Run validation and record baseline problems**

Run:

```powershell
npm run ebook:build
npm run ebook:check
```

Expected: the validator may report legacy issues in Modules 2–7. Record them
under a `## Baseline validation debt` section in `ebook/curriculum-matrix.md`.
Fix only structural blockers that prevent building; preserve editorial repairs
for each module's later plan.

- [ ] **Step 6: Commit the matrix and validation contract**

```powershell
git add ebook/curriculum-matrix.md scripts/validate-ebook.mjs tests/ebook-module01.test.mjs
git commit -m "test: define ebook curriculum and validation contracts"
```

---

### Task 5: Build a verified Module 1 research and citation ledger

**Files:**
- Create: `ebook/references/module-01-sources.md`
- Modify: `ebook/curriculum-matrix.md`

- [ ] **Step 1: Research the mandatory claims using primary or authoritative sources**

Verify, with current working links:

- Definitions and models of interaction and feedback.
- Human response-time thresholds and their proper attribution.
- Argentina's ISDB-T adoption date and regulatory context.
- ISDB-T/ISDB-Tb architecture.
- Ginga, NCL, and Lua roles.
- DEVENDRA's institution, objective, implementation, and documented reach.
- Historical/current status of Netflix, Flow, and DIRECTV streaming interfaces.
- ATSC, DVB, and ISDB differences at a level appropriate to the module.

Prefer official standards bodies, Argentine government or university sources,
W3C/ITU publications, official platform help/developer material, and recognized
HCI books. Avoid using search snippets, unsourced blogs, or videos as evidence
for technical and historical claims.

- [ ] **Step 2: Record every source in a structured ledger**

Create `ebook/references/module-01-sources.md`:

```markdown
# Fuentes verificadas · Módulo 1

Cada fuente debe registrar la fecha exacta de consulta.

| ID | Tema respaldado | Autor/Institución | Título | Año/fecha | URL | Consulta | Uso previsto |
|---|---|---|---|---|---|---|---|
```

Use stable identifiers `M1-S01`, `M1-S02`, and so on. Include at least eight
sources, with more than one source for historically sensitive claims such as
adoption dates and DEVENDRA.

- [ ] **Step 3: Add a claim audit**

Below the table, add:

```markdown
## Auditoría de afirmaciones

| Afirmación | Fuente | Resultado |
|---|---|---|
```

Populate four rows for Argentina's ISDB-T adoption, Ginga's role, DEVENDRA's
documented scope, and the attribution of response-time thresholds. Each row must
use the real `M1-Snn` identifier assigned in the source table and a result of
either `verificada` or `corregida`.

Do not retain a claim whose source cannot be verified. Rewrite it with the
available evidence or label the uncertainty explicitly.

- [ ] **Step 4: Update matrix coverage**

Add the relevant real `M1-Snn` identifiers to the Module 1 rows in
`ebook/curriculum-matrix.md` using a new `Fuentes` column.

- [ ] **Step 5: Validate links manually**

Open every URL in the ledger and confirm:

- It resolves.
- The title and institution match the ledger.
- It supports the stated claim.
- It is not merely a search result or copied summary.

- [ ] **Step 6: Commit the research ledger**

```powershell
git add ebook/references/module-01-sources.md ebook/curriculum-matrix.md
git commit -m "docs: verify sources for ebook Module 1"
```

---

### Task 6: Replace Module 1 with the approved pedagogical architecture

**Files:**
- Modify: `ebook/modules/module-01.html`
- Modify: `tests/ebook-module01.test.mjs`

- [ ] **Step 1: Replace the Module 1 outline with stable semantic sections**

Use this exact top-level order:

```html
<article class="ebook-module module-01" data-module="1" id="module-1">
  <section class="opener">
    <div class="big">01</div>
    <div class="ey">Bloque 1 · Medios y Diseño Interactivo</div>
    <h1>La interactividad y la TV digital interactiva</h1>
    <p class="sub">Del espectador al participante: cómo una acción se convierte en respuesta y experiencia.</p>
  </section>
  <section class="body">
    <section id="m1-interactividad"><h2>Qué significa interactuar</h2></section>
    <section id="m1-ciclo"><h2>El ciclo de interacción</h2></section>
    <section id="m1-niveles"><h2>Niveles y modelos de interactividad</h2></section>
    <section id="m1-tv-digital"><h2>De la televisión analógica a la televisión digital</h2></section>
    <section id="m1-ginga"><h2>ISDB-Tb, Ginga, NCL y Lua</h2></section>
    <section id="m1-devendra"><h2>DEVENDRA: un caso argentino</h2></section>
    <section id="m1-plataformas"><h2>Netflix, Flow y DIRECTV Play</h2></section>
    <section id="m1-sintesis"><h2>Síntesis conceptual</h2></section>
    <section id="m1-preguntas"><h2>Preguntas para comprobar la comprensión</h2></section>
    <section id="m1-glosario"><h2>Glosario</h2></section>
    <section id="m1-videos"><h2>Videos para observar con criterio</h2></section>
    <section id="m1-bibliografia"><h2>Bibliografía y fuentes</h2></section>
    <section id="m1-puente"><h2>Puente hacia el Módulo 2</h2></section>
  </section>
</article>
```

- [ ] **Step 2: Write the opening, purpose, prerequisites, and conceptual map**

The opening must:

- Connect convergence of media, digitized video, Internet, and IP.
- Explain why this belongs in a programming degree.
- State what the student will understand by the end.
- Preserve the three formal micro-objectives.
- Introduce a map from user action to platform, application, middleware,
  transport/broadcast infrastructure, response, and experience.

Do not present the ebook as an offline summary of the campus; present it as the
complete theoretical material.

- [ ] **Step 3: Develop interactivity and interactive language fully**

Cover:

- Interaction, reactivity, participation, and bidirectionality.
- Input, system state, processing, output, feedback, and the next action.
- Immediate versus delayed feedback.
- Direct manipulation and perceived agency.
- Limits of the action–process–feedback analogy.
- Passive, reactive, and interactive systems with counterexamples.
- Accessibility as part of the interaction channel.

Each concept must answer what it is, what problem it addresses, how it works,
why it matters, its limits, and a real example.

- [ ] **Step 4: Present levels as a model, not an unquestionable universal taxonomy**

Retain the useful five-level progression only if the source audit can support
its origin and limits. Otherwise label it explicitly as the ebook's analytical
model and compare it with at least one recognized alternative.

For every level provide:

- Defining criterion.
- User agency.
- Data flow.
- Example.
- Borderline case.
- Typical design risk.

- [ ] **Step 5: Expand TV digital from historical context to technical architecture**

Cover:

- Analog broadcasting versus digitized broadcasting.
- Signal, multiplex, service, data/application layer, and receiver.
- Terrestrial digital television and Internet streaming as different delivery
  architectures.
- ATSC, DVB, and ISDB families at comparative overview level.
- Argentina and ISDB-Tb with sourced dates and terminology.
- Return channel possibilities and limitations.
- Why "digital" does not automatically mean "interactive."

- [ ] **Step 6: Explain Ginga, NCL, and Lua without false analogies**

Explain:

- Middleware's purpose.
- Declarative coordination in NCL.
- Procedural logic in Lua.
- Lifecycle from authored application to receiver execution.
- Security, device constraints, remote-control input, and portability limits.

If using the analogy “NCL is like HTML and Lua is like JavaScript,” immediately
state where it breaks down.

Include a short, pedagogical NCL/Lua code example only when every line can be
explained accurately; label code that is illustrative rather than executable.

- [ ] **Step 7: Reconstruct DEVENDRA as a sourced case study**

Use the structure:

```html
<div class="case-study">
  <h3>Problema</h3>
  <h3>Contexto tecnológico</h3>
  <h3>Arquitectura de interacción</h3>
  <h3>Alcance documentado</h3>
  <h3>Qué demuestra y qué no demuestra</h3>
</div>
```

Do not claim measured impact, geographical reach, or operation without an
explicit source.

- [ ] **Step 8: Compare Netflix, Flow, and DIRECTV Play systematically**

Use a comparison table whose rows include:

- Delivery architecture.
- Primary input devices.
- Navigation model.
- Personalization.
- Feedback.
- Live versus on-demand behavior.
- Accessibility.
- Multi-device continuity.
- Dependence on Internet connectivity.
- Interactivity level under the selected model.

Use dated wording such as “en la interfaz consultada en junio de 2026” for
features that can change. Separate platform/interface observations from the
technical architecture underneath.

- [ ] **Step 9: Add synthesis, reflection, glossary, videos, bibliography, and bridge**

Requirements:

- Synthesis must state relationships, not repeat headings.
- Include 8–12 non-graded reflection/autocheck questions.
- Glossary must include at least: interactivity, feedback, agency, middleware,
  ISDB-Tb, Ginga, NCL, Lua, multiplex, return channel, streaming, VOD.
- Every video must show channel/author, approximate duration, verified URL,
  reason for inclusion, and what to observe.
- Bibliography entries must map to the source ledger identifiers.
- The bridge to Module 2 must explain why a technically interactive system can
  still produce poor UX.

- [ ] **Step 10: Run contract tests**

Run:

```powershell
npm test
```

Expected: section and bibliography tests move toward PASS; image tests may still
fail until Task 7 creates local figures.

- [ ] **Step 11: Commit the editorial reconstruction**

```powershell
git add ebook/modules/module-01.html tests/ebook-module01.test.mjs
git commit -m "feat: reconstruct ebook Module 1 content"
```

---

### Task 7: Create didactic figures and print-safe visual components

**Files:**
- Create: `ebook/assets/module-01/interaction-cycle.svg`
- Create: `ebook/assets/module-01/tv-evolution-timeline.svg`
- Create: `ebook/assets/module-01/standards-map.svg`
- Create: `ebook/assets/module-01/isdbt-ginga-pipeline.svg`
- Create: `ebook/assets/module-01/devendra-flow.svg`
- Create: `ebook/assets/module-01/platform-comparison.svg`
- Modify: `ebook/modules/module-01.html`
- Modify: `ebook/template/ebook.css`

- [ ] **Step 1: Define the reusable figure markup**

Use:

```html
<figure class="didactic-figure">
  <img
    src="ebook/assets/module-01/interaction-cycle.svg"
    width="1200"
    height="700"
    alt="Ciclo de interacción: una acción modifica el estado del sistema, el sistema procesa el cambio y devuelve feedback que orienta la siguiente acción."
  >
  <figcaption>
    <span class="figure-number">Figura 1.1.</span>
    El feedback cierra un ciclo y habilita la siguiente decisión del usuario.
    <span class="figure-source">Fuente: elaboración propia.</span>
  </figcaption>
</figure>
```

Every figure needs a number, explanatory caption, textual source, intrinsic
dimensions, and an alt text that conveys the teaching point.

- [ ] **Step 2: Create the six SVG figures**

Create each SVG as editable vector markup using:

- A `viewBox`.
- Module 1 gold accent plus neutral colors.
- Minimum 16 px body text in the SVG coordinate system.
- Arrow markers defined once in `<defs>`.
- No raster data or external fonts.
- A title and description using `<title>` and `<desc>`.

The figures must communicate:

1. Interaction cycle with system state and iteration.
2. Timeline from analog broadcasting to digital TV and streaming.
3. Comparison of ATSC, DVB, and ISDB families without implying compatibility.
4. ISDB-Tb → receiver → Ginga → NCL/Lua → interface → user pipeline.
5. Sourced DEVENDRA flow, distinguishing broadcast path and any return/data path.
6. Netflix/Flow/DIRECTV Play comparison across device, content, and feedback.

- [ ] **Step 3: Add print-safe component styles**

Append focused styles to `ebook/template/ebook.css`:

```css
.ebook-module section[id] {
  scroll-margin-top: 1rem;
}

.didactic-figure,
.case-study,
.concept-map,
.reflection-questions,
.bibliography {
  break-inside: avoid;
}

.didactic-figure {
  margin: 1.25rem 0 1.5rem;
}

.didactic-figure img {
  display: block;
  width: 100%;
  height: auto;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #fff;
}

.didactic-figure figcaption {
  margin-top: .5rem;
  color: var(--soft);
  font: 9pt/1.45 "Segoe UI", Arial, sans-serif;
}

.figure-number {
  color: var(--ink);
  font-weight: 700;
}

.figure-source {
  display: block;
  margin-top: .2rem;
  font-size: 8pt;
}

@media print {
  a[href^="http"]::after {
    content: "";
  }

  .ebook-module {
    break-before: page;
  }

  h2, h3, h4 {
    break-after: avoid;
  }

  pre, table, figure {
    break-inside: avoid;
  }
}
```

- [ ] **Step 4: Replace all Module 1 base64 images**

Remove all `data:image` sources from `ebook/modules/module-01.html`. Use the new
local SVGs and only retain a raster image if it adds evidence that a diagram
cannot provide. Any retained screenshot must be local, dated, sourced, and
legible in print.

- [ ] **Step 5: Run the image and content tests**

Run:

```powershell
npm test
npm run ebook:build
npm run ebook:check
```

Expected: all Module 1 contract tests PASS. General validation either PASSes or
reports only documented legacy debt from Modules 2–7.

- [ ] **Step 6: Commit the visual system**

```powershell
git add ebook/assets/module-01 ebook/modules/module-01.html ebook/template/ebook.css
git commit -m "feat: add didactic figures for ebook Module 1"
```

---

### Task 8: Export integral and Module 1 PDFs reproducibly

**Files:**
- Create: `scripts/export-ebook.mjs`
- Modify: `.gitignore`
- Generate: `PAI3_ebook.pdf`
- Generate: `PAI3_M01_Interactividad_TV.pdf`

- [ ] **Step 1: Ignore only temporary export files**

Append:

```gitignore
# Temporary ebook build files
.tmp/
```

- [ ] **Step 2: Implement the PDF export orchestrator**

Create `scripts/export-ebook.mjs`:

```js
import { pathToFileURL } from "node:url";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";

const jobs = [
  ["ebook-muestra.html", "PAI3_ebook.pdf"],
  [".tmp/ebook-module-01.html", "PAI3_M01_Interactividad_TV.pdf"]
];

for (const [input, output] of jobs) {
  const url = pathToFileURL(resolve(input)).href;
  const result = spawnSync(
    "npx",
    [
      "--yes",
      "playwright",
      "pdf",
      "--format",
      "A4",
      url,
      output
    ],
    {
      encoding: "utf8",
      shell: process.platform === "win32"
    }
  );

  if (result.status !== 0) {
    console.error(result.stdout);
    console.error(result.stderr);
    process.exit(result.status ?? 1);
  }

  console.log(`Exported ${output}`);
}
```

- [ ] **Step 3: Build and export**

Run:

```powershell
npm run ebook:build
npm run ebook:pdf
```

Expected: both PDFs are created with nonzero size.

- [ ] **Step 4: Verify output existence and size**

Run:

```powershell
Get-Item PAI3_ebook.pdf, PAI3_M01_Interactividad_TV.pdf |
  Select-Object Name, Length, LastWriteTime
```

Expected: both files exist, were updated during this run, and are larger than
100 KB.

- [ ] **Step 5: Commit export tooling**

```powershell
git add .gitignore scripts/export-ebook.mjs
git commit -m "build: automate ebook PDF export"
```

Do not commit regenerated PDFs unless the user explicitly wants binary
deliverables versioned.

---

### Task 9: Browser and PDF quality assurance

**Files:**
- Modify as needed: `ebook/modules/module-01.html`
- Modify as needed: `ebook/template/ebook.css`
- Modify as needed: `ebook/assets/module-01/*.svg`
- Modify: `ebook/curriculum-matrix.md`

- [ ] **Step 1: Start a local server**

Run:

```powershell
python -m http.server 8125
```

Expected: server listens on `http://localhost:8125`.

- [ ] **Step 2: Verify the integral HTML in a real browser**

Open `http://localhost:8125/ebook-muestra.html` and verify:

- Cover and TOC render.
- Module 1 starts on a new page-like section.
- Every Module 1 heading is visible and ordered correctly.
- All six figures load.
- Tables fit without horizontal overflow.
- Long URLs do not escape their containers.
- Bibliography links are clickable.
- Modules 2–7 still render after the Module 1 boundary.
- Browser console has no errors.

- [ ] **Step 3: Inspect print preview at A4**

Check:

- No orphaned headings at page bottoms.
- No clipped figures or code blocks.
- Captions stay with figures.
- Table rows remain readable.
- Colors retain sufficient contrast.
- Page breaks do not create large accidental blanks.
- Module 1 has no campus-only instruction required for comprehension.

- [ ] **Step 4: Inspect representative PDF pages**

Review at minimum:

- Module opener.
- Concept map.
- Interaction cycle.
- Standards comparison.
- Ginga pipeline.
- DEVENDRA case.
- Platform comparison.
- Reflection questions.
- Bibliography.
- Transition into Module 2 in the integral PDF.

- [ ] **Step 5: Update curricular status based on evidence**

In `ebook/curriculum-matrix.md`, mark each Module 1 row:

- `cubierto` only when the final HTML contains a substantive explanation.
- `verificado` only when its supporting sources were checked.
- `validado en PDF` only after print inspection.

Do not change Modules 2–7 statuses during this task.

- [ ] **Step 6: Run the final verification suite**

Run:

```powershell
npm test
npm run ebook:build
npm run ebook:check
npm run ebook:pdf
git diff --check
```

Expected:

- Tests PASS.
- Build succeeds.
- Validator has no Module 1 failures.
- PDF export succeeds.
- `git diff --check` reports no whitespace errors.

- [ ] **Step 7: Commit final Module 1 quality fixes**

```powershell
git add ebook ebook-muestra.html tests scripts package.json .gitignore
git commit -m "feat: complete print-ready ebook Module 1"
```

Exclude `.tmp/`, `.superpowers/`, and PDFs unless explicitly requested.

---

### Task 10: Final editorial review and handoff

**Files:**
- Modify: `ebook/README.md`
- Modify: `ebook/curriculum-matrix.md`

- [ ] **Step 1: Perform a terminology consistency review**

Search Module 1 for:

```powershell
rg -n "interacción|interactividad|reactividad|feedback|retroalimentación|middleware|ISDB|Ginga|NCL|Lua|streaming|canal de retorno" ebook/modules/module-01.html
```

Confirm each term is introduced before use and used consistently. If both
“feedback” and “retroalimentación” appear, define the relationship once.

- [ ] **Step 2: Perform an unsupported-claim review**

Read every sentence containing a date, number, superlative, named project,
standard, product feature, or measured effect. Ensure it has a bibliography
reference or is rewritten as a clearly identified interpretation.

- [ ] **Step 3: Document the completed workflow**

Add to `ebook/README.md`:

```markdown
## Estado editorial

- Módulo 1: reconstruido, validado y exportado.
- Módulos 2–7: migrados desde la versión existente; pendientes de revisión
  profunda mediante planes separados.

## Criterio de cierre por módulo

Un módulo se cierra cuando su matriz curricular está cubierta, sus fuentes están
verificadas, las pruebas pasan y el HTML/PDF superan la revisión visual A4.
```

- [ ] **Step 4: Produce the handoff summary**

Report:

- Files created and modified.
- Module 1 page count in the generated PDF.
- Number of verified sources.
- Number of didactic figures.
- Validation/test commands and results.
- Known debt remaining in Modules 2–7.
- Exact next plan: Module 2, not a global rewrite.

- [ ] **Step 5: Commit documentation**

```powershell
git add ebook/README.md ebook/curriculum-matrix.md
git commit -m "docs: record ebook Module 1 completion"
```
