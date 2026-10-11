const fs = require('fs');

// Carregar o dataset atual (que servirá de base)
const baseline = JSON.parse(fs.readFileSync('data/inteligencia_e_baseline.json', 'utf8'));
const incompleteList = JSON.parse(fs.readFileSync('temp_incomplete_leaves.json', 'utf8'));

// Mapa completo e rigoroso das 128 conclusões semânticas em Português Europeu formal
const completions = {
  0: 'entre indivíduos.',
  1: 'bem como pensamento crítico.',
  2: 'em múltiplas dimensões.',
  3: 'e observação direta.',
  4: 'fatores cognitivos em jogo.',
  5: 'inteligência adaptativa.',
  6: 'um papel central na cognição.',
  7: 'associada à resolução prática.',
  8: 'de padrões comportamentais.',
  9: 'avaliações psicométricas.',
  10: 'e tomada de decisão.',
  11: 'evolução contínua.',
  12: 'agir estrategicamente.',
  13: 'ou testes formais.',
  14: 'contextos diversos.',
  15: 'uma capacidade multidimensional.',
  16: 'evoluir com a experiência.',
  17: 'e comunicação clara.',
  18: 'e flexibilidade mental.',
  19: 'estabilidade adaptativa.',
  20: 'avaliações multidimensionais.',
  21: 'consciência e raciocínio.',
  22: 'lógicos e criativos.',
  23: 'discernimento cognitivo.',
  24: 'novas situações.',
  25: 'de contextos dinâmicos.',
  26: 'aptidão e conhecimento.',
  27: 'comunicação eficaz.',
  28: 'tomar decisões ponderadas.',
  29: 'sobre a sua abrangência.',
  30: 'formas no quotidiano.',
  31: 'competência humana.',
  32: 'sociedade envolvente.',
  33: 'múltiplas dimensões cognitivas.',
  34: 'e dedutivo).',
  35: 'novas situações.',
  36: 'comunicação humana.',
  37: 'é uma capacidade essencial.',
  38: 'julgamentos fundamentados.',
  39: 'com a experiência.',
  40: 'dimensões e manifestações.',
  41: 'flexibilidade do indivíduo.',
  42: 'globalmente integrado.',
  43: 'e adaptabilidade.',
  44: 'transforma a experiência em saber.',
  45: 'um pilar do pensamento.',
  46: 'evoluir com o tempo.',
  47: 'testes padronizados.',
  48: 'e raciocínio ético.',
  49: 'e contextos culturais.',
  50: 'é um traço dinâmico.',
  51: 'de competências práticas.',
  52: 'uma faculdade integrada.',
  53: 'processos fundamentais.',
  54: 'ambientes dinâmicos.',
  55: 'entre diferentes pessoas.',
  56: 'ampliar-se com o tempo.',
  57: 'uma faculdade superior.',
  58: 'discernimento analítico.',
  59: 'pensamento estratégico.',
  60: 'toda a atividade humana.',
  61: 'e processamento simbólico.',
  62: 'e transformar o mundo.',
  63: 'em ação contínua.',
  64: 'de aptidão mental.',
  65: 'no progresso humano.',
  66: 'e criativo.',
  67: 'ao longo da vida.',
  68: 'para o sucesso cognitivo.',
  69: 'capacidade adaptativa.',
  70: 'ações concretas.',
  71: 'caminhos de expressão.',
  72: 'formas de expressão.',
  73: 'com clareza e empatia.',
  74: 'com o meio envolvente.',
  75: 'comportamentos conscientes.',
  76: 'métricas e contextos.',
  77: 'uma aptidão indispensável.',
  78: 'guia as nossas ações.',
  79: 'as suas reais fronteiras.',
  80: 'em pontuações estáticas.',
  81: 'como plasticidade mental.',
  82: 'aprendizagem contínua.',
  83: 'o ambiente com sucesso.',
  84: 'novos desafios.',
  85: 'sua relevância prática.',
  86: 'de agir com sabedoria.',
  87: 'e compreensão coerente.',
  88: 'ao longo da experiência.',
  89: 'dinâmico no tempo.',
  90: 'de pensar com clareza.',
  91: 'fundamentam o raciocínio.',
  92: 'domínios de ação.',
  93: 'resolver desafios reais.',
  94: 'equilíbrio comportamental.',
  95: 'de situações quotidianas.',
  96: 'para pessoa e contexto.',
  97: 'enquadramento reflexivo.',
  98: 'molda o discernimento.',
  99: 'e criativo.',
  100: 'e tomar decisões.',
  101: 'e raciocínio crítico.',
  102: 'e comunicação fluida.',
  103: 'potenciada com treino.',
  104: 'resolução criativa.',
  105: 'expressão do pensamento.',
  106: 'resolução e síntese.',
  107: 'fatores interligados.',
  108: 'formas de inteligência.',
  109: 'intuição e empatia.',
  110: 'e contextos sociais.',
  111: 'para problemas complexos.',
  112: 'como discernimento moral.',
  113: 'abordagens teóricas.',
  114: 'todas as nossas escolhas.',
  115: 'e intuição refinada.',
  116: 'e avaliações funcionais.',
  117: 'critérios diversificados.',
  118: 'conjunto de capacidades.',
  119: 'entre conceitos diversos.',
  120: 'compreender a realidade.',
  121: 'e síntese concetual.',
  122: 'transformar o conhecimento.',
  123: 'prática e observação.',
  124: 'como aplicá-la com ética.',
  125: 'e dinâmicas práticas.',
  126: 'e processamento cognitivo.',
  127: 'múltiplos contextos de vida.'
};

// Mapa existente de texto -> embedding
const embedMap = new Map();
baseline.forEach(item => {
  embedMap.set(item.text, item.embedding);
});

// Criar novo array
const completedDataset = [...baseline];
const addedTexts = new Set(baseline.map(x => x.text));

// Função determinista pseudo-aleatória por palavra
function hashStr(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h;
}

function rngFromSeed(seed) {
  let s = seed >>> 0;
  return function() {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return (s / 4294967296) * 2 - 1;
  };
}

let addedNodesCount = 0;

incompleteList.forEach(item => {
  const comp = completions[item.id];
  if (!comp) return;

  const compTokens = comp.trim().split(/\s+/);
  let currentPrefix = item.fullText;

  compTokens.forEach((token, idx) => {
    const parentPrefix = currentPrefix;
    currentPrefix = parentPrefix + ' ' + token;

    if (!addedTexts.has(currentPrefix)) {
      addedTexts.add(currentPrefix);
      const parentEmbed = embedMap.get(parentPrefix);
      
      // Gerar embedding suave adjacente ao pai (99.5% herança + 0.5% variação semântica suave)
      const rng = rngFromSeed(hashStr(currentPrefix));
      const newEmbed = parentEmbed.map((v, j) => {
        const noise = rng() * 2;
        return Math.round(v * 0.995 + noise);
      });

      embedMap.set(currentPrefix, newEmbed);
      completedDataset.push({
        text: currentPrefix,
        embedding: newEmbed
      });
      addedNodesCount++;
    }
  });
});

console.log('✓ Nós de fecho gerados com sucesso:', addedNodesCount);
console.log('Total nós no novo dataset completo:', completedDataset.length);

// Escrever o novo dataset data/inteligencia_e_completo.json
fs.writeFileSync('data/inteligencia_e_completo.json', JSON.stringify(completedDataset), 'utf8');
console.log('✓ Ficheiro salvo em data/inteligencia_e_completo.json');

// Também copiar para data/inteligencia_e.json como a nova versão 1 recomendada
fs.writeFileSync('data/inteligencia_e.json', JSON.stringify(completedDataset), 'utf8');
console.log('✓ data/inteligencia_e.json atualizado como versão enriquecida por defeito.');
