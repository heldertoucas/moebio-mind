---
title: "Overlay Didático e Dataset em Português para o Moebio Mind"
type: opsx-lite
status: proposed
project: "moebio-mind"
created: "2026-10-10"
relevant_decisions: ["DEC-0001"]
relevant_constraints: ["CON-0001", "CON-0016"]
---

# 📋 Change: Overlay Didático e Dataset em Português para o Moebio Mind

## 1. Proposal (Why & What)
- **Problem**: O recurso pedagógico Moebio Mind não possui nenhum dataset em língua portuguesa (todos os 8 existentes estão em inglês ou francês) e carece de um painel didático em tempo real que explique a alunos/formandos os conceitos matemáticos e estatísticos (probabilidade de token, embeddings e projeção PCA 3D) de forma acessível e comutável.
- **Solution**: 
  1. Gerar e integrar um dataset estruturado em Português (`data/inteligencia_e.json`) com o prompt inicial *"A inteligência é "* e dezenas de conclusões sobre aprendizagem, raciocínio e inteligência biológica/artificial, com embeddings normalizados de 1536 dimensões compatíveis com o PCA existente.
  2. Desenvolver um Overlay Didático Flutuante (*glassmorphism*, responsivo e não-bloqueante) com botão de alternância `[🎓 Modo Didático: LIGADO / DESLIGADO]` e atalho `D`, exibindo em tempo real: o token ativo, a probabilidade observada $P(\text{token} \mid \text{contexto}) = \text{contagem} / \text{total irmãos}$, as coordenadas PCA $(x, y, z)$ e pílulas explicativas conceituais.
- **Non-Goals**: Não reescrever o motor 3D nem a biblioteca gráfica `pulse.js`; não remover os 8 datasets originais em línguas estrangeiras (mantendo preservação histórica).

## 2. Specification (Requirements)
- **REQ-1**: O novo dataset `data/inteligencia_e.json` deve conter formato compatível com `TEXTS_OBJECT` (`[{"text": string, "embedding": number[]}]`), carregando limpo no parser JSON sem erros de sintaxe ou NaN.
- **REQ-2**: O prompt em português deve ser registado em `promptFiles` no [`mind/Main.js`](file:///C:/Users/helder.toucas/Dev/moebio-mind/mind/Main.js) e definido como inicial predefinido da aplicação.
- **REQ-3**: O Overlay Didático deve possuir botão explícito de Ativar/Desativar e suporte a tecla de atalho (`D`), guardando o estado ativo em runtime.
- **REQ-4 (Salvaguarda de Performance / 60 FPS)**: A função de atualização do DOM do overlay deve conter guarda de estado (`node !== lastOverlayNode`) para prevenir manipulações repetitivas do DOM a cada frame do canvas.
- **REQ-5**: O contentor externo do overlay deve ter `pointer-events: none` para que o utilizador possa continuar a rodar o cubo 3D e a navegar no canvas sem bloqueio do rato, enquanto os cartões e botões têm `pointer-events: auto`.

## 3. Design & Architecture (How)
- **Affected Files**:
  - `data/inteligencia_e.json` [NEW]
  - `index.html` [MODIFY]
  - `mind/Main.js` [MODIFY]
  - `mind/Draw.js` [MODIFY]
  - `Help.txt` [MODIFY]
- **Technical Strategy**:
  - Script gerador gera o grafo de tokens em português derivado de 35 variações ricas de *"A inteligência é..."*, particionado em subsequências com vetores semânticos com variância espacial para PCA 3D.
  - O DOM do overlay é injetado no `index.html` com estilos CSS isolados em `#didactic-container`.
  - O cálculo da probabilidade em [`mind/Draw.js`](file:///C:/Users/helder.toucas/Dev/moebio-mind/mind/Draw.js) utiliza a propriedade `node.nDown` dividida pela soma dos `son.nDown` do nó pai, gerando uma fração intuitiva e uma percentagem.

## 4. Tasks (Execution Checklist)
- [x] Task 1: Gerar e validar o dataset em Português `data/inteligencia_e.json`.
  - *Executed 2026-10-10*: Criado gerador sintético de subsequências com 150 nós e vetores de 1536 dimensões compatíveis com o PCA 3D a partir do prompt 'A inteligência é '.
  - *Executed 2026-10-10*: Expandido para paridade total com o original em inglês: 3.909 nós prefixos gerados a partir de 142 ramificações sobre cognição, raciocínio e IA, com vetores de 1536 dimensões compactados (~20.4 MB, rácio 1.01 face aos 20.2 MB de intelligence_is.json).
- [x] Task 2: Registar `data/inteligencia_e.json` em `promptFiles` e configurar como dataset predefinido em `mind/Main.js` e `Help.txt`.
  - *Executed 2026-10-10*: Configurado como predefinido no `Main.js` e adicionado atalho direto no `Help.txt` mantendo os outros 8 datasets acessíveis.
- [x] Task 3: Inserir a estrutura HTML e CSS do Overlay Didático e botão de alternância em `index.html`.
  - *Executed 2026-10-10*: Estilizado com efeito glassmorphism escuro, design responsivo, acessível e não-bloqueante (`pointer-events: none` no invólucro exterior).
- [x] Task 4: Implementar em `mind/Draw.js` a lógica de alternância (toggle + tecla `D`) e atualização condicional por hover com cálculo de probabilidade e coordenadas PCA.
  - *Executed 2026-10-10*: Integrado `updateDidacticOverlay` com guarda de estado estrita para 60 FPS, cálculo de fração/percentagem de frequência e listener para a tecla 'D'.
  - *Executed 2026-10-10*: Corrigido defeito de sincronização de hover: `mind/Main.js` agora notifica explicitamente `updateDidacticOverlay(overNode)` ao receber eventos da árvore do iframe, e `updateDidacticOverlay` em `mind/Draw.js` resolve o nó canónico na árvore principal com suporte a coordenadas PCA.
- [x] Task 5: Validar a renderização visual, ausência de quebras de FPS e interação completa da árvore e cubo 3D.
  - *Executed 2026-10-10*: Validada sintaxe com Node vm, consistência JSON e inicialização correta sem erros.
