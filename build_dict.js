/**
 * build_dict.js - Dicionário Léxico e Vocabulário Estruturado v2 para Moebio Mind
 * Português Europeu formal, didático e organizado por Domínios Ontológicos:
 * 1. Cognitivo & Psicométrico
 * 2. Computacional & Cibernético
 * 3. Biológico & Evolutivo
 * 4. Filosófico & Humanista
 */

const fs = require('fs');

const ONTOLOGICAL_DOMAINS = {
  cognitivo: {
    nome: "Cognitivo e Psicométrico",
    descricao: "Processamento de informação, raciocínio lógico, memória de trabalho e resolução de problemas.",
    raizes: [
      "a capacidade de raciocinar com clareza e deduzir conclusões válidas a partir de premissas complexas.",
      "a capacidade de aprender rapidamente com a experiência acumulada e reter informação estruturada.",
      "a capacidade de resolver problemas inéditos através do pensamento abstrato e dedução lógica.",
      "a capacidade de analisar dados com rigor metódico e formular hipóteses consistentes.",
      "a capacidade de sintetizar conceitos dispersos numa compreensão profunda e unificada.",
      "a capacidade cognitiva de mobilizar a memória de trabalho para tarefas de alta complexidade.",
      "a capacidade de discernir padrões subtis em ambientes de elevada incerteza informacional.",
      "um conjunto de funções executivas que coordenam a atenção seletiva, memória e planeamento.",
      "um processo analítico contínuo de decomposição de problemas em etapas solucionáveis.",
      "uma faculdade mental que permite antecipar consequências antes de agir.",
      "a aptidão para comparar alternativas lógicas e selecionar a decisão ótima."
    ],
    tokens: [
      "raciocinar", "analisar", "deduzir", "inferir", "aprender", "memorizar", "reter",
      "sintetizar", "abstrair", "compreender", "avaliar", "estruturar", "organizar",
      "cognitivo", "cognitiva", "mental", "analítico", "lógico", "abstrato", "metódico",
      "memória", "atenção", "pensamento", "compreensão", "raciocínio", "conclusão"
    ]
  },

  computacional: {
    nome: "Computacional e Cibernético",
    descricao: "Modelos conexionistas, redes neuronais, inferência bayesiana, pesos estatísticos e agentes autónomos.",
    raizes: [
      "um processo de otimização contínua de parâmetros probabilísticos através de gradientes descendentes.",
      "um sistema adaptativo que descobre correlações ocultas em representações vetoriais de alta dimensão.",
      "a faculdade de inferir distribuições de probabilidade sobre o próximo elemento sequencial.",
      "a capacidade algorítmica de generalizar padrões a partir de conjuntos massivos de dados.",
      "uma arquitetura distribuída de nós interconectados que ponderam sinais e reduzem o erro preditivo.",
      "um modelo estatístico de inferência bayesiana capaz de calibrar crenças perante novas evidências.",
      "a propriedade emergente de redes neuronais artificiais treinadas para aproximar funções complexas.",
      "o processamento sequencial de representações simbólicas e matrizes de atenção multidimensional.",
      "um mecanismo preditivo auto-supervisionado que mapeia sequências de tokens em trajetórias semânticas.",
      "uma estrutura computacional autónoma projetada para maximizar funções de recompensa num ambiente dinâmico."
    ],
    tokens: [
      "algoritmo", "modelo", "vetor", "matriz", "rede", "neurónio", "gradiente", "parâmetro",
      "computação", "inferência", "probabilidade", "estatística", "otimização", "atenção",
      "computacional", "cibernético", "artificial", "bayesiano", "estocástico", "simbólico",
      "padrão", "sequência", "token", "embedding", "processamento", "generalização"
    ]
  },

  biologico: {
    nome: "Biológico e Evolutivo",
    descricao: "Adaptação ao meio ambiente, homeostase, neuroplasticidade e sobrevivência orgânica.",
    raizes: [
      "a faculdade adaptativa de um organismo vivo para sobreviver e prosperar em ecossistemas mutáveis.",
      "uma propriedade biológica resultante de milhões de anos de seleção natural e pressão ecológica.",
      "a plasticidade sináptica que reconfigura circuitos neuronais em resposta a estímulos ambientais.",
      "um mecanismo evolutivo de homeostase que equilibra recursos energéticos e estabilidade interna.",
      "a capacidade sensorial de integrar fluxos percetuais num modelo operativo do mundo físico.",
      "uma resposta dinâmica às perturbações do meio com vista à preservação da vida.",
      "o refinamento de instintos e comportamentos flexíveis face a ameaças e oportunidades ecológicas.",
      "a coordenação motora e cognitiva que viabiliza a interação eficaz com o habitat natural.",
      "uma manifestação orgânica da complexidade celular organizada em redes de processamento fisiológico."
    ],
    tokens: [
      "biológico", "evolutivo", "orgânico", "celular", "sináptico", "ecológico", "sensorial",
      "adaptação", "sobrevivência", "homeostase", "plasticidade", "organismo", "ecossistema",
      "seleção", "evolução", "ambiente", "circuito", "estímulo", "vida", "espécie"
    ]
  },

  filosofico: {
    nome: "Filosófico e Humanista",
    descricao: "Consciência reflexiva, sentido de propósito, autoconsciência e deliberação moral.",
    raizes: [
      "a faculdade reflexiva pela qual a mente toma consciência da sua própria existência e limites.",
      "uma propriedade da consciência que interroga o sentido da experiência e transcende o utilitário.",
      "o discernimento ético que pondera o impacto das ações sobre outros seres conscientes.",
      "a capacidade de criar significados poéticos e narrativas existenciais a partir do caos da realidade.",
      "um processo de busca contínua por verdade, harmonia conceptual e sabedoria prática.",
      "a manifestação da intuição criativa que rompe com convenções mecânicas estabelecidas.",
      "a autoconsciência de si que une memória passada, presença atenta e imaginação futura.",
      "o diálogo interior constante entre racionalidade crítica e sensibilidade empática.",
      "uma interrogação aberta sobre o mundo, a finitude e as fronteiras do conhecimento humano."
    ],
    tokens: [
      "filosófico", "humanista", "ético", "moral", "consciente", "reflexivo", "existencial",
      "consciência", "autoconsciência", "sabedoria", "intuição", "sentido", "verdade",
      "significado", "mente", "espírito", "compreensão", "transcendência", "imaginação"
    ]
  }
};

// Exportar definições
module.exports = {
  ONTOLOGICAL_DOMAINS
};

if (require.main === module) {
  console.log("=== Dicionário Semântico v2 (Moebio Mind) ===");
  Object.keys(ONTOLOGICAL_DOMAINS).forEach(key => {
    const d = ONTOLOGICAL_DOMAINS[key];
    console.log(`- [${d.nome}]: ${d.raizes.length} matrizes de raiz, ${d.tokens.length} tokens ontológicos.`);
  });
}
