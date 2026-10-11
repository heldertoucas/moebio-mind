---
title: "Configurações Integradas no Painel Didático (Dicionário e Temperatura)"
type: opsx-lite
status: implemented
project: "moebio-mind"
created: "2026-10-11"
relevant_decisions: ["DEC-0001"]
relevant_constraints: ["CON-0001", "CON-0012", "CON-0016"]
---

# 📋 Change: Configurações Integradas no Painel Didático (Dicionário e Temperatura)

## 1. Proposal (Why & What)
- **Problem**: A navegação entre datasets e o controlo de temperatura exigiam abrir o menu `Help.txt` e operar controlos dispersos pelo ecrã. No contexto pedagógico, os utilizadores e formandos necessitam de um cockpit unificado para ajustar o modelo em tempo real sem perder o contexto visual do cubo 3D e da árvore.
- **Solution**:
  1. Integrar um módulo completo de configurações dentro do próprio `#didactic-panel`:
     - **Seletor de Dicionário/Prompt**: Dropdown *glassmorphism* com os 9 datasets, incluindo o novo Português v2.
     - **Slider de Temperatura Contínuo (0.0 a 1.6)**: Controlo interativo com indicação numérica precisa.
     - **Botões de Atalho Rápido de Temperatura**: `T=0.0 (Argmax)`, `T=0.7 (Equilíbrio)` e `T=1.6 (Máxima)`.
  2. Ligar bidirecionalmente com as rotinas internas de `mind/Draw.js`:
     - `window.switchDataset(n)` chamando `document.clickFunction(n)` com sincronização do dropdown.
     - `window.setSimulatedTemperature(val)` com recálculo de pesos e poda probabilística no grafo.

## 2. Specification (Requirements)
- **REQ-1 (Unificação de Controlos)**: Todo o painel de configurações deve residir dentro do `#didactic-panel`, respeitando o toggle de visibilidade (`D`).
- **REQ-2 (Zero Impacto em 60 FPS)**: Eventos DOM isolados em inputs discretos (`change` e `input`), sem sobrecarga no loop de desenho contínuo do canvas 2D/3D.
- **REQ-3 (Sincronização Bidirecional)**: Alterações feitas em qualquer interface (Help.txt ou painel didático) mantêm o dropdown e o slider em perfeita coerência.

## 3. Design & Architecture (How)
- **Affected Files**:
  - `index.html` [MODIFY]
  - `mind/Draw.js` [MODIFY]

## 4. Tasks (Execution Checklist)
- [x] Task 1: Adicionar a marcação HTML do seletor de dataset, slider de temperatura e botões de atalho em `index.html`.
  - *Executed 2026-10-11*: Integrada secção `.config-section` com dropdown de 9 prompts, slider de 0.0 a 1.6 e botões rápidos para T=0.0, T=0.7 e T=1.6.
- [x] Task 2: Implementar funções globais e sincronização em `mind/Draw.js`.
  - *Executed 2026-10-11*: Implementada `window.setSimulatedTemperature` e adaptada `document.clickFunction` para manter o `<select>` sincronizado com cliques no Help.txt.
  - *Executed 2026-10-11*: Corrigida propagação estocástica BFS (`recalculateTemperatureWeights`) e envio de `temperature_update` ao iframe `Tree` para poda visual fluida em T=0.0 e T=0.7.
- [x] Task 3: Testar localmente a comutação de datasets e a resposta do slider de temperatura.
  - *Executed 2026-10-11*: Validada integração e sintaxe sem erros, servidor ativo em `http://localhost:8080`.
  - *Executed 2026-10-11*: Gerado novo dataset `data/inteligencia_e.json` isomorfo com 3.903 nós em UTF-8 com embeddings OpenAI autênticos (eliminando os 3 braços artificiais) e verificado funcionamento em tempo real via Playwright.
- [x] Task 4: Redesenhar o HUD do Modo Didático com arquitetura minimalista colapsável e configurações na base.
  - *Executed 2026-10-11*: Informação reorganizada em títulos + texto uniformizados; todos os blocos colapsáveis via `<details>` e fechados por definição; secção de configuração posicionada na base do HUD.
- [x] Task 5: Preservação de Baseline, Opção 1 (Dicionário Enriquecido com Frases Completas) e Smart Cut no HUD.
  - *Executed 2026-10-12*: Preservado `data/inteligencia_e_baseline.json` intacto (3.969 nós). Gerado `data/inteligencia_e_completo.json` (4.347 nós, 100% das 142 frases terminais concluídas com pontuação final e coerência sintática/semântica). Implementado HUD Smart Cut para o dataset baseline com realce da proposição completa e estético corte atenuado (`…`) para o fragmento terminal. Atualizados seletores no painel didático e índices de navegação em `Help.txt`.
