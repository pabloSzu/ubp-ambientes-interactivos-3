# Materiales UBP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Generate a complete local delivery folder with four polished PDF materials per module for PAI3.

**Architecture:** A Node.js generator owns the module data, visual HTML templates, folder creation, and PDF export orchestration. The generated `UBP/` folder is ignored by git and can be deleted/regenerated without affecting the deployed site.

**Tech Stack:** Node.js filesystem APIs, HTML/CSS print layouts, Playwright CLI for PDF export, local source documents and module URLs.

---

### Task 1: Output Contract

**Files:**
- Modify: `.gitignore`
- Create: `scripts/generate-ubp-materials.js`
- Generated: `UBP/Modulo_XX_*/{OBJETIVOS,GLOSARIO,ACTIVIDADES,CONTENIDO}/`

- [x] **Step 1: Ignore generated delivery artifacts**

Add `UBP/` to `.gitignore` so produced academic materials stay local.

- [ ] **Step 2: Create a deterministic generator**

The generator must create exactly seven module folders. Each module folder must contain `OBJETIVOS`, `GLOSARIO`, `ACTIVIDADES`, and `CONTENIDO` subfolders.

- [ ] **Step 3: Generate editable HTML and final PDFs**

Each subfolder must receive one `.html` source and, after Playwright export, one `.pdf` with the same base name.

### Task 2: Content Model

**Files:**
- Create: `scripts/generate-ubp-materials.js`

- [ ] **Step 1: Encode module metadata**

For each module define number, title, block, accent color, deployed URL, objectives, glossary, activities, and content sections.

- [ ] **Step 2: Cover all required themes**

Use `CONTENIDOS_MAESTRO.md`, `DOCUMENTO_MAESTRO_MATERIA.md`, and existing module pages as the source of truth. Include the gaps listed in the maestro as enrichment topics where they improve completeness.

### Task 3: Visual Template

**Files:**
- Create: `scripts/generate-ubp-materials.js`

- [ ] **Step 1: Build print-ready HTML**

Create a shared layout with cover, large module link, QR area or link fallback, section cards, diagrams, callouts, and print CSS.

- [ ] **Step 2: Specialize by material type**

`OBJETIVOS` should be concise and formal. `GLOSARIO` should use visual term cards. `ACTIVIDADES` should include steps and rubric. `CONTENIDO` should be the richest PDF, with theory, diagrams, examples, and recap.

### Task 4: Export And Verify

**Files:**
- Generated: `UBP/**`

- [ ] **Step 1: Run the generator**

Run `node scripts/generate-ubp-materials.js`.

- [ ] **Step 2: Export PDFs**

Run Playwright PDF export for every generated HTML file.

- [ ] **Step 3: Verify output**

Confirm there are 28 PDFs, 28 HTML sources, four subfolders per module, and `UBP/` is ignored by git.
