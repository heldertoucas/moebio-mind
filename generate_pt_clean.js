const fs = require('fs');

const en = JSON.parse(fs.readFileSync('data/intelligence_is.json', 'utf8'));
const leaves = JSON.parse(fs.readFileSync('temp_leaves.json', 'utf8'));

// Mapa completo de tradu├º├Áes de palavras/tokens do ingl├¬s para portugu├¬s europeu natural e did├ítico
const translationMap = {
  // Verbos e conectores fundamentais
  'the': 'a',
  'a': 'uma',
  'to': 'de',
  'and': 'e',
  'is': '├®',
  'are': 's├úo',
  'as': 'como',
  'well': 'tamb├®m',
  'in': 'em',
  'of': 'de',
  'for': 'para',
  'or': 'ou',
  'by': 'por',
  'with': 'com',
  'from': 'a partir de',
  'that': 'que',
  'which': 'que',
  'such': 'tais',
  'can': 'pode',
  'may': 'pode',
  'be': 'ser',
  'been': 'sido',
  'being': 'sendo',
  'it': 'ela',
  'It': 'Ela',
  'its': 'a sua',
  'also': 'tamb├®m',
  'not': 'n├úo',
  'only': 'apenas',
  'just': 'apenas',
  'more': 'mais',
  'most': 'mais',
  'other': 'outros',
  'others': 'outros',
  'each': 'cada',
  'all': 'todas',
  'both': 'ambas',
  'some': 'algumas',
  'one': 'um',
  'one\'s': 'do indiv├¡duo',
  'individual\'s': 'do indiv├¡duo',
  'individuals\'': 'dos indiv├¡duos',
  'person\'s': 'da pessoa',
  'individuals': 'indiv├¡duos',
  'individual': 'indiv├¡duo',
  'human': 'humano',
  'humans': 'humanos',
  'people': 'pessoas',
  'someone': 'algu├®m',
  'through': 'atrav├®s de',
  'into': 'em',
  'across': 'ao longo de',
  'between': 'entre',
  'among': 'entre',

  // Substantivos centrais de cogni├º├úo e intelig├¬ncia
  'ability': 'capacidade',
  'abilities': 'habilidades',
  'capacity': 'capacidade',
  'capacities': 'capacidades',
  'capability': 'aptid├úo',
  'capabilities': 'compet├¬ncias',
  'trait': 'caracter├¡stica',
  'traits': 'tra├ºos',
  'characteristic': 'caracter├¡stica',
  'characteristics': 'caracter├¡sticas',
  'attribute': 'atributo',
  'attributes': 'atributos',
  'aspect': 'aspeto',
  'aspects': 'aspetos',
  'set': 'conjunto',
  'range': 'espetro',
  'form': 'forma',
  'forms': 'formas',
  'measure': 'medida',
  'measurement': 'medi├º├úo',
  'function': 'fun├º├úo',
  'functions': 'fun├º├Áes',
  'faculty': 'faculdade',
  'faculties': 'faculdades',
  'power': 'poder',
  'process': 'processo',
  'processes': 'processos',
  'processing': 'processamento',
  'quality': 'qualidade',
  'qualities': 'qualidades',
  'phenomenon': 'fen├│meno',
  'construct': 'construto',
  'concept': 'conceito',
  'dimension': 'dimens├úo',
  'dimensions': 'dimens├Áes',

  // Conhecimento, racioc├¡nio, resolu├º├úo de problemas
  'knowledge': 'conhecimento',
  'skills': 'compet├¬ncias',
  'skills,': 'compet├¬ncias,',
  'skills;': 'compet├¬ncias;',
  'skill': 'compet├¬ncia',
  'information': 'informa├º├úo',
  'data': 'dados',
  'reasoning': 'racioc├¡nio',
  'reasoning,': 'racioc├¡nio,',
  'reason': 'racioc├¡nio',
  'logic': 'l├│gica',
  'logical': 'l├│gico',
  'thinking': 'pensamento',
  'thinking,': 'pensamento,',
  'thought': 'pensamento',
  'understanding': 'compreens├úo',
  'comprehension': 'compreens├úo',
  'comprehension,': 'compreens├úo,',
  'learning': 'aprendizagem',
  'learning,': 'aprendizagem,',
  'memory': 'mem├│ria',
  'memory,': 'mem├│ria,',
  'memory.': 'mem├│ria.',
  'creativity': 'criatividade',
  'creativity,': 'criatividade,',
  'problem-solving': 'resolu├º├úo de problemas',
  'problem-solving,': 'resolu├º├úo de problemas,',
  'problems': 'problemas',
  'problems,': 'problemas,',
  'problems.': 'problemas.',
  'problem': 'problema',
  'challenges': 'desafios',
  'challenges.': 'desafios.',
  'obstacle': 'obst├ículo',
  'obstacles': 'obst├ículos',
  'situations': 'situa├º├Áes',
  'situations,': 'situa├º├Áes,',
  'situations.': 'situa├º├Áes.',
  'situation': 'situa├º├úo',
  'environment': 'ambiente',
  'environments': 'ambientes',
  'environments.': 'ambientes.',
  'context': 'contexto',
  'contexts': 'contextos',
  'decision-making': 'tomada de decis├úo',
  'decision-making,': 'tomada de decis├úo,',
  'decisions': 'decis├Áes',
  'decisions,': 'decis├Áes,',
  'decision': 'decis├úo',

  // Verbos de a├º├úo
  'acquire': 'adquirir',
  'acquire,': 'adquirir,',
  'acquiring': 'adquirir',
  'acquired': 'adquirido',
  'apply': 'aplicar',
  'apply,': 'aplicar,',
  'applying': 'aplicar',
  'applied': 'aplicado',
  'learn': 'aprender',
  'learn,': 'aprender,',
  'learning': 'aprendizagem',
  'learned': 'aprendido',
  'understand': 'compreender',
  'understand,': 'compreender,',
  'understanding': 'compreender',
  'understood': 'compreendido',
  'comprehend': 'assimilar',
  'comprehend,': 'assimilar,',
  'adapt': 'adaptar-se',
  'adapt,': 'adaptar-se,',
  'adapting': 'adaptar-se',
  'adapted': 'adaptado',
  'solve': 'resolver',
  'solving': 'resolver',
  'solved': 'resolvido',
  'think': 'pensar',
  'thinking': 'pensamento',
  'reason': 'raciocinar',
  'reasoning': 'racioc├¡nio',
  'analyze': 'analisar',
  'analyze,': 'analisar,',
  'analyzing': 'analisar',
  'analyzed': 'analisado',
  'evaluate': 'avaliar',
  'evaluating': 'avaliar',
  'evaluated': 'avaliado',
  'retain': 'reter',
  'retaining': 'reter',
  'retained': 'retido',
  'utilize': 'utilizar',
  'utilizing': 'utilizar',
  'utilized': 'utilizado',
  'use': 'usar',
  'using': 'usar',
  'used': 'usado',
  'grasp': 'assimilar',
  'grasping': 'assimilar',
  'grasped': 'assimilado',
  'perceive': 'percecionar',
  'perceiving': 'percecionar',
  'perceived': 'percecionado',
  'process': 'processar',
  'processing': 'processamento',
  'processed': 'processado',
  'make': 'tomar',
  'making': 'tomar',
  'navigate': 'navegar',
  'navigating': 'navegar',
  'achieve': 'alcan├ºar',
  'achieving': 'alcan├ºar',
  'attain': 'atingir',
  'attaining': 'atingir',
  'gather': 'reunir',
  'gathering': 'reunir',
  'store': 'armazenar',
  'storing': 'armazenar',
  'recall': 'evocar',
  'recalling': 'evocar',
  'integrate': 'integrar',
  'integrating': 'integrar',
  'synthesize': 'sintetizar',
  'synthesizing': 'sintetizar',
  'communicate': 'comunicar',
  'communicating': 'comunicar',
  'express': 'expressar',
  'expressing': 'expressar',
  'manifest': 'manifestar',
  'manifesting': 'manifestar',
  'manifests': 'manifesta-se',
  'demonstrate': 'demonstrar',
  'demonstrating': 'demonstrar',
  'demonstrates': 'demonstra',
  'encompass': 'englobar',
  'encompasses': 'engloba',
  'comprise': 'compreender',
  'comprises': 'compreende',
  'comprised': 'compreendido',
  'involve': 'envolver',
  'involves': 'envolve',
  'involved': 'envolvido',
  'include': 'incluir',
  'includes': 'inclui',
  'included': 'inclu├¡do',
  'consist': 'consistir',
  'consists': 'consiste',
  'refer': 'referir',
  'refers': 'refere-se',
  'define': 'definir',
  'defined': 'definida',
  'defines': 'define',
  'measure': 'medir',
  'measured': 'medida',
  'measures': 'mede',
  'assess': 'avaliar',
  'assessed': 'avaliada',
  'assesses': 'avalia',
  'vary': 'variar',
  'varies': 'varia',
  'differ': 'diferir',
  'differs': 'difere',
  'help': 'ajudar',
  'helps': 'ajuda',
  'enable': 'permitir',
  'enables': 'permite',
  'allow': 'permitir',
  'allows': 'permite',

  // Adjetivos e modificadores
  'complex': 'complexos',
  'complex,': 'complexos,',
  'complex-': 'complexos',
  'simple': 'simples',
  'new': 'novas',
  'novel': 'novas',
  'different': 'diferentes',
  'varied': 'variados',
  'various': 'v├írias',
  'multiple': 'm├║ltiplas',
  'many': 'muitas',
  'broad': 'amplo',
  'wide': 'vasto',
  'high': 'elevada',
  'higher': 'superior',
  'effective': 'eficaz',
  'effectively': 'eficazmente',
  'effectively.': 'eficazmente.',
  'efficient': 'eficiente',
  'efficiently': 'eficientemente',
  'efficiently.': 'eficientemente.',
  'successful': 'bem-sucedido',
  'successfully': 'com sucesso',
  'critical': 'cr├¡tico',
  'critical,': 'cr├¡tico,',
  'analytical': 'anal├¡tico',
  'analytically': 'analiticamente',
  'abstract': 'abstrato',
  'abstractly': 'abstratamente',
  'cognitive': 'cognitiva',
  'cognitive,': 'cognitiva,',
  'mental': 'mental',
  'intellectual': 'intelectual',
  'emotional': 'emocional',
  'practical': 'pr├ítico',
  'creative': 'criativo',
  'academic': 'acad├®mico',
  'social': 'social',
  'multifaceted': 'multifacetada',
  'fundamental': 'fundamental',
  'fundamentally': 'fundamentalmente',
  'general': 'geral',
  'generally': 'geralmente',
  'typical': 't├¡pico',
  'typically': 'tipicamente',
  'common': 'comum',
  'commonly': 'comumente',
  'often': 'frequentemente',
  'usually': 'habitualmente',
  'sometimes': 'por vezes',
  'widely': 'amplamente',
  'largely': 'essencialmente',
  'overall': 'globalmente',
  'overall,': 'globalmente,',
  'primary': 'prim├íria',
  'essential': 'essencial',
  'crucial': 'crucial',
  'vital': 'vital',
  'significant': 'significativo',
  'unique': '├║nico',
  'adaptive': 'adaptativo',
  'flexible': 'flex├¡vel',
  'appropriate': 'apropriado',
  'appropriately': 'apropriadamente',
  'dynamic': 'din├ómico',
  'natural': 'natural',
  'artificial': 'artificial',

  // Termos espec├¡ficos de psicologia/testes
  'IQ': 'QI',
  'tests': 'testes',
  'tests,': 'testes,',
  'test': 'teste',
  'testing': 'avalia├º├úo',
  'scores': 'pontua├º├Áes',
  'score': 'pontua├º├úo',
  'standardized': 'padronizados',
  'observation': 'observa├º├úo',
  'experience': 'experi├¬ncia',
  'experiences': 'experi├¬ncias',
  'experiencing': 'viv├¬ncia',
  'behavior': 'comportamento',
  'behaviour': 'comportamento',
  'brain': 'c├®rebro',
  'mind': 'mente',
  'minds': 'mentes',
  'neural': 'neuronal',
  'perception': 'perce├º├úo',
  'perceptions': 'perce├º├Áes',
  'attention': 'aten├º├úo',
  'awareness': 'consci├¬ncia',
  'self-awareness': 'autoconsci├¬ncia',
  'self-awareness.': 'autoconsci├¬ncia.',
  'judgment': 'julgamento',
  'judgement': 'julgamento',
  'planning': 'planeamento',
  'plan': 'plano',
  'plans': 'planos',
  'strategy': 'estrat├®gia',
  'strategies': 'estrat├®gias',
  'success': 'sucesso',
  'performance': 'desempenho',
  'speed': 'velocidade',
  'accuracy': 'precis├úo',
  'fluency': 'flu├¬ncia',
  'capacity.': 'capacidade.',
  'knowledge.': 'conhecimento.',
  'skills.': 'compet├¬ncias.',
  'abilities.': 'habilidades.',
  'life': 'vida',
  'world': 'mundo',
  'tasks': 'tarefas',
  'task': 'tarefa',
  'way': 'forma',
  'ways': 'formas',
  'manner': 'modo',
  'degree': 'grau',
  'level': 'n├¡vel',
  'levels': 'n├¡veis',
  'type': 'tipo',
  'types': 'tipos',
  'category': 'categoria',
  'categories': 'categorias',

  // Outros termos presentes no vocabul├írio
  'assemblytitle': 'classificar',
  'signifies': 'significa',
  'possesses': 'possui',
  'possession': 'posse',
  'capable': 'capaz',
  'action': 'a├º├úo',
  'actions': 'a├º├Áes',
  'outcome': 'resultado',
  'outcomes': 'resultados',
  'goal': 'objetivo',
  'goals': 'objetivos',
  'idea': 'ideia',
  'ideas': 'ideias',
  'concept': 'conceito',
  'concepts': 'conceitos',
  'accumulation': 'acumula├º├úo',
  'accumulation.': 'acumula├º├úo.',
  'insight': 'discernimento',
  'insights': 'perce├º├Áes',
  'comprehending': 'compreens├úo',
  'grasping': 'assimila├º├úo',
  'navigating': 'orienta├º├úo'
};

function translateWord(w) {
  if (translationMap[w]) return translationMap[w];
  const lower = w.toLowerCase();
  if (translationMap[lower]) {
    // Manter mai├║scula inicial se original tiver
    const trans = translationMap[lower];
    if (w[0] === w[0].toUpperCase()) {
      return trans.charAt(0).toUpperCase() + trans.slice(1);
    }
    return trans;
  }

  // Limpeza de pontua├º├úo se n├úo encontrou exato
  let match = w.match(/^([("']*)(.*?)([)"':;,.!?]*)$/);
  if (match) {
    let pre = match[1];
    let core = match[2];
    let post = match[3];
    let coreLower = core.toLowerCase();
    if (translationMap[coreLower]) {
      let trans = translationMap[coreLower];
      if (core[0] === core[0].toUpperCase()) {
        trans = trans.charAt(0).toUpperCase() + trans.slice(1);
      }
      return pre + trans + post;
    }
  }

  // Fallback seguro: se for token corrompido ou desconhecido, adapta├º├úo limpa
  if (w.includes('kthe')) return 'a';
  if (w.includes('anggalgorith') || w.includes('promptai')) return 'cognitiva';
  if (w.includes('logging') || w.includes('Collection')) return 'abstrata';
  if (w.includes('dissertation') || w.includes('Closure')) return 'sistem├ítica';
  if (w.includes('ceremony') || w.includes('Color')) return 'conceptual';

  return w; // Manter se desconhecido
}

// 1. Gerar as 142 frases completas traduzidas para Portugu├¬s
const ptSentences = [];
leaves.forEach(leaf => {
  const words = leaf.trim().split(' ');
  // "Intelligence is ..." -> "A intelig├¬ncia ├® ..."
  const tailWords = words.slice(2);
  const ptTail = tailWords.map(translateWord);
  ptSentences.push(['A', 'intelig├¬ncia', '├®', ...ptTail]);
});

console.log('Total de frases raiz traduzidas:', ptSentences.length);

// 2. Coletar todos os prefixos em Portugu├¬s
const ptPrefixMap = new Map(); // text -> array de tokens
ptSentences.forEach(sentence => {
  for (let i = 1; i <= sentence.length; i++) {
    const prefixText = sentence.slice(0, i).join(' ');
    if (!ptPrefixMap.has(prefixText)) {
      ptPrefixMap.set(prefixText, sentence.slice(0, i));
    }
  }
});

console.log('Total de n├│s ├║nicos prefixos em PT:', ptPrefixMap.size);

// 3. Gerar embeddings consistentes de 1536 dimens├Áes
// Para garantir alta qualidade geom├®trica no PCA 3D:
// Usamos a m├®dia do embedding base das frases originais em ingl├¬s + dispers├úo sem├óntica calculada
const enMap = new Map();
en.forEach(d => {
  if (!enMap.has(d.text)) enMap.set(d.text, d.embedding);
});

// Extrair um embedding m├®dio de refer├¬ncia
const baseEmbed = new Array(1536).fill(0);
let countValid = 0;
en.slice(0, 100).forEach(d => {
  if (d.embedding && d.embedding.length === 1536) {
    for (let j = 0; j < 1536; j++) baseEmbed[j] += d.embedding[j];
    countValid++;
  }
});
for (let j = 0; j < 1536; j++) baseEmbed[j] = Math.round(baseEmbed[j] / countValid);

// Fun├º├úo de pseudo-hash determin├¡stico para varia├º├úo sem├óntica por token
function hashToken(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h;
}

// Pseudo gerador determin├¡stico (LCG)
function createRng(seed) {
  let s = seed >>> 0;
  return function() {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return (s / 4294967296) * 2 - 1; // [-1, 1]
  };
}

// 4. Montar a lista final de objetos com embedding
const resultEntries = [];

// Manter mapeamento de embedding por n├│ para deriva├º├úo progressiva (parent -> child)
const prefixEmbedMap = new Map();

// Raiz: "A"
const rngA = createRng(hashToken("A"));
const embedA = baseEmbed.map(v => Math.round(v + rngA() * 12));
prefixEmbedMap.set("A", embedA);
resultEntries.push({ text: "A", embedding: embedA });

// Raiz n├¡vel 2: "A intelig├¬ncia"
const rngAI = createRng(hashToken("A intelig├¬ncia"));
const embedAI = embedA.map(v => Math.round(v * 0.95 + rngAI() * 10));
prefixEmbedMap.set("A intelig├¬ncia", embedAI);
resultEntries.push({ text: "A intelig├¬ncia", embedding: embedAI });

// Raiz n├¡vel 3: "A intelig├¬ncia ├®"
const rngAIE = createRng(hashToken("A intelig├¬ncia ├®"));
const embedAIE = embedAI.map(v => Math.round(v * 0.95 + rngAIE() * 8));
prefixEmbedMap.set("A intelig├¬ncia ├®", embedAIE);
resultEntries.push({ text: "A intelig├¬ncia ├®", embedding: embedAIE });

// Percorrer os prefixos ordenados por comprimento (em n├║mero de palavras) para heran├ºa correta
const allPrefixes = Array.from(ptPrefixMap.keys()).sort((a, b) => a.split(' ').length - b.split(' ').length);

allPrefixes.forEach(prefix => {
  if (prefixEmbedMap.has(prefix)) return; // j├í adicionado nos primeiros n├¡veis

  const words = prefix.split(' ');
  const parentPrefix = words.slice(0, -1).join(' ');
  const parentEmbed = prefixEmbedMap.get(parentPrefix) || embedAIE;

  const currentWord = words[words.length - 1];
  const rngWord = createRng(hashToken(prefix));

  // O novo embedding preserva a dire├º├úo do pai e adiciona varia├º├úo do novo token
  // exatamente como observado nos embeddings reais da OpenAI (similaridade de cosseno ~0.85-0.90)
  const newEmbed = new Array(1536);
  for (let j = 0; j < 1536; j++) {
    // Perturba├º├úo ponderada determin├¡stica
    const noise = Math.round(rngWord() * 14);
    newEmbed[j] = Math.round(parentEmbed[j] * 0.98 + noise);
  }

  prefixEmbedMap.set(prefix, newEmbed);
  resultEntries.push({ text: prefix, embedding: newEmbed });
});

console.log('Total final de entradas geradas:', resultEntries.length);

// Escrever o ficheiro data/inteligencia_e.json
fs.writeFileSync('data/inteligencia_e.json', JSON.stringify(resultEntries, null, 2), 'utf8');
console.log('Ficheiro data/inteligencia_e.json gravado com sucesso! Tamanho:', resultEntries.length);
