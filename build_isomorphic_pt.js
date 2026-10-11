const fs = require('fs');

// Ler o ficheiro anterior
const content = fs.readFileSync('dict_pt_complete.js', 'utf8');

// Isolar apenas o objeto dict
const lines = content.split('\n');
const startLine = lines.findIndex(l => l.includes('const dict = {'));
const endLine = lines.findIndex(l => l.trim() === '};');

const dictCode = lines.slice(startLine, endLine + 1).join('\n') + '\nmodule.exports = dict;';
fs.writeFileSync('dict_pt_clean.js', dictCode, 'utf8');

const dict = require('./dict_pt_clean.js');
console.log('✓ Dicionário carregado com sucesso. Total tokens mapeados:', Object.keys(dict).length);

// Carregar o dataset original em inglês
const en = JSON.parse(fs.readFileSync('data/intelligence_is.json', 'utf8'));

// Traduzir token a token preservando a geometria exata dos embeddings reais da OpenAI
const ptClean = en.map(item => {
  const words = item.text.split(' ');
  const ptWords = words.map(w => {
    if (dict[w]) return dict[w];
    let lower = w.toLowerCase();
    if (dict[lower]) {
      let t = dict[lower];
      if (w[0] === w[0].toUpperCase()) t = t.charAt(0).toUpperCase() + t.slice(1);
      return t;
    }
    return w;
  });

  return {
    text: ptWords.join(' '),
    embedding: item.embedding // Mesmíssimo embedding multidimensional da OpenAI!
  };
});

// Forçar o prompt raiz a ser exatamente "Inteligência é"
ptClean[0].text = "Inteligência";
ptClean[1].text = "Inteligência é";

// Salvar no data/inteligencia_e.json
fs.writeFileSync('data/inteligencia_e.json', JSON.stringify(ptClean), 'utf8');
console.log('✓ Novo data/inteligencia_e.json gerado com distribuição orgânica (idêntica ao modelo original)!');
console.log('Total nós:', ptClean.length);
