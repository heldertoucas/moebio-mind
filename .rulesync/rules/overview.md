---
root: true
targets: ["*"]
description: "Project overview, 3D visualization, and dataset scripts for moebio-mind (PRJ-0032 / REP-0031)"
globs: ["**/*"]
---

# Project Instructions: moebio-mind (PRJ-0032 / REP-0031)

## Product Vision
Simulador interativo 3D e visualizador de espaço semântico / PCA de modelos de linguagem para língua portuguesa, publicado como aplicação estática client-side (Moebius Mind).

## DU Context & Pointers
- **Project Dossier**: `02-projects/PRJ-0032/project.md`
- **Repository Identity**: `REP-0031` (Role: frontend)
- **Memory & Planning**: Gerido via DU Context Engine; propostas sob `openspec/changes/`.

## Tech Stack
- **Frontend**: Vanilla JavaScript (ES6+), HTML5 Canvas, WebGL / 3D Visualization
- **Data Processing**: Node.js scripts de extração e redução dimensional
- **Datasets**: Dicionários e matrizes de coocorrência léxica em Português (`data/`)
- **Hosting**: GitHub Pages / Static hosting (`.nojekyll`)

## Architecture
- **Structure**: Aplicação web client-side sem framework de build pesado.
- **Key Files & Directories**:
  - `index.html`: Ponto de entrada da visualização interativa.
  - `mind/`: Módulos de renderização 3D, câmara e física de partículas.
  - `data/`: Datasets léxicos compilados em formato JSON / JS.
  - `generate_pt_clean.js`: Pipeline de limpeza e normalização léxica.
  - `build_dict.js`: Compilador de dicionário semântico otimizado.

## Build & Generation Commands
- **Generate Clean Dataset**: `node generate_pt_clean.js`
- **Build Dictionary**: `node build_dict.js`
- **Local Preview**: `python -m http.server 8080` (ou qualquer servidor estático local)

## Quality Gates & Invariants
- **Client-Side Autonomy**: A visualização deve funcionar a 100% no browser sem dependências de backend dinâmico.
- **Character Encoding**: Todos os datasets em língua portuguesa devem preservar rigorosamente a codificação UTF-8.
