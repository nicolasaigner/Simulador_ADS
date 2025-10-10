---
sidebar_position: 1
---

# Exemplos Básicos

Exemplos práticos de código prontos para usar.

## 🚀 Configuração Inicial

### Instalação e Inicialização

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/simulador-ads.git
cd simulador-ads

# Instalar dependências
npm install

# Iniciar servidor
npm start
```

O servidor estará disponível em `http://localhost:3000`

---

## 📚 Exemplos Completos

### 1. Listar Todas as Matérias

```javascript
async function listarMaterias() {
  const response = await fetch('http://localhost:3000/api/courses');
  const { data } = await response.json();
  
  console.log('📚 Matérias Disponíveis:\n');
  data.forEach(materia => {
    console.log(`${materia.id}. ${materia.name}`);
    console.log(`   Total: ${materia.totalQuestions} questões`);
    console.log(`   Atividades: ${materia.totalQuizQuestions}`);
    console.log(`   Provas: ${materia.totalExamQuestions}\n`);
  });
}

listarMaterias();
```

---

### 2. Gerar Simulado Completo

```javascript
async function gerarSimulado(materia, quantidade = 10) {
  const response = await fetch('http://localhost:3000/api/quiz/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      courseSlug: materia,
      limit: quantidade,
      shuffle: true
    })
  });
  
  const { quiz } = await response.json();
  
  console.log(`\n🎯 Simulado: ${quiz.courseName}`);
  console.log(`📝 Total de questões: ${quiz.totalQuestions}\n`);
  
  quiz.questions.forEach((q, i) => {
    console.log(`${i + 1}. ${q.question}\n`);
    
    if (q.type === 'objective') {
      q.options.forEach((opt, j) => {
        console.log(`   ${String.fromCharCode(65 + j)}) ${opt.text}`);
      });
    }
    
    console.log(`\n   ✅ Resposta: ${q.answer}\n`);
    console.log('─'.repeat(80) + '\n');
  });
}

// Uso
gerarSimulado('arquitetura-de-sistemas', 5);
```

---

### 3. Aplicação de Quiz Interativa

```javascript
class QuizApp {
  constructor(courseSlug) {
    this.courseSlug = courseSlug;
    this.quiz = null;
    this.userAnswers = [];
    this.currentQuestion = 0;
  }
  
  async initialize(limit = 10) {
    const response = await fetch('http://localhost:3000/api/quiz/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseSlug: this.courseSlug,
        limit,
        type: 'objective',
        shuffle: true
      })
    });
    
    const data = await response.json();
    this.quiz = data.quiz;
    
    console.log(`\n🎓 Quiz iniciado: ${this.quiz.courseName}`);
    console.log(`📊 Total de questões: ${this.quiz.totalQuestions}\n`);
    
    return this;
  }
  
  showCurrentQuestion() {
    const q = this.quiz.questions[this.currentQuestion];
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Questão ${this.currentQuestion + 1}/${this.quiz.totalQuestions}`);
    console.log(`${'='.repeat(80)}\n`);
    console.log(q.question + '\n');
    
    q.options.forEach((opt, i) => {
      console.log(`${String.fromCharCode(65 + i)}) ${opt.text}`);
    });
    
    return q;
  }
  
  answerQuestion(userAnswer) {
    this.userAnswers.push({
      courseId: this.quiz.courseId,
      questionIndex: this.currentQuestion,
      userAnswer: userAnswer,
      source: 'quizzes'
    });
    
    this.currentQuestion++;
  }
  
  hasNextQuestion() {
    return this.currentQuestion < this.quiz.totalQuestions;
  }
  
  async finalize() {
    console.log('\n🎯 Corrigindo simulado...\n');
    
    const response = await fetch('http://localhost:3000/api/quiz/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers: this.userAnswers })
    });
    
    const { data } = await response.json();
    
    console.log(`${'='.repeat(80)}`);
    console.log('📊 RESULTADO FINAL');
    console.log(`${'='.repeat(80)}\n`);
    console.log(`✅ Acertos: ${data.correct}`);
    console.log(`❌ Erros: ${data.incorrect}`);
    console.log(`📈 Percentual: ${data.percentage}%\n`);
    
    data.results.forEach((result, i) => {
      const emoji = result.isCorrect ? '✅' : '❌';
      console.log(`${i + 1}. ${emoji} ${result.question.substring(0, 60)}...`);
      
      if (!result.isCorrect) {
        console.log(`   Sua resposta: ${result.userAnswer}`);
        console.log(`   Resposta correta: ${result.correctAnswer}`);
      }
      console.log('');
    });
    
    return data;
  }
}

// Uso
async function iniciarQuiz() {
  const quiz = await new QuizApp('arquitetura-de-sistemas').initialize(5);
  
  // Simular respostas do usuário
  const respostas = [
    "Uma abordagem que integra desenvolvimento e operações para melhorar a entrega de software.",
    "Foco exclusivo na equipe de desenvolvimento.",
    "Ela incentiva a automação, colaboração e feedback contínuo para otimizar entregas de software.",
    "Reduzir falhas de implantação e melhorar a recuperação em caso de erros.",
    "A prática de gerenciar e provisionar infraestrutura por meio de código em vez de processos manuais."
  ];
  
  respostas.forEach(resposta => {
    quiz.showCurrentQuestion();
    quiz.answerQuestion(resposta);
  });
  
  await quiz.finalize();
}

iniciarQuiz();
```

---

### 4. Dashboard de Estatísticas

```javascript
async function mostrarDashboard() {
  const response = await fetch('http://localhost:3000/api/courses/stats');
  const { data } = await response.json();
  
  console.log('\n📊 DASHBOARD - SIMULADOR ADS\n');
  console.log(`${'='.repeat(80)}\n`);
  
  console.log('📚 RESUMO GERAL');
  console.log(`   Total de matérias: ${data.totalCourses}`);
  console.log(`   Total de questões: ${data.totalQuestions}`);
  console.log(`   Questões objetivas: ${data.objectiveQuestions} (${((data.objectiveQuestions/data.totalQuestions)*100).toFixed(1)}%)`);
  console.log(`   Questões discursivas: ${data.discursiveQuestions} (${((data.discursiveQuestions/data.totalQuestions)*100).toFixed(1)}%)`);
  console.log(`   Questões com imagens: ${data.questionsWithImages}\n`);
  
  console.log(`${'='.repeat(80)}\n`);
  console.log('📋 DETALHAMENTO POR MATÉRIA\n');
  
  // Ordenar por total de questões
  const sorted = data.courseBreakdown.sort((a, b) => b.totalQuestions - a.totalQuestions);
  
  sorted.forEach((course, i) => {
    console.log(`${i + 1}. ${course.name}`);
    console.log(`   Total: ${course.totalQuestions} questões`);
    console.log(`   Atividades: ${course.quizQuestions} | Provas: ${course.examQuestions}`);
    console.log(`   Objetivas: ${course.objectiveQuestions} | Discursivas: ${course.discursiveQuestions}`);
    if (course.questionsWithImages > 0) {
      console.log(`   🖼️  Com imagens: ${course.questionsWithImages}`);
    }
    console.log('');
  });
}

mostrarDashboard();
```

---

### 5. Busca e Filtro de Questões

```javascript
async function buscarQuestoes(termo, filtros = {}) {
  const params = new URLSearchParams({ q: termo, ...filtros });
  const response = await fetch(`http://localhost:3000/api/search?${params}`);
  const data = await response.json();
  
  console.log(`\n🔍 Resultados para: "${termo}"`);
  console.log(`📊 Total encontrado: ${data.count} questões\n`);
  
  if (data.count === 0) {
    console.log('Nenhuma questão encontrada.');
    return;
  }
  
  // Agrupar por matéria
  const porMateria = {};
  data.data.forEach(q => {
    if (!porMateria[q.courseName]) {
      porMateria[q.courseName] = [];
    }
    porMateria[q.courseName].push(q);
  });
  
  Object.entries(porMateria).forEach(([materia, questoes]) => {
    console.log(`📚 ${materia} (${questoes.length} questões)`);
    questoes.forEach((q, i) => {
      console.log(`   ${i + 1}. [${q.type}] ${q.question.substring(0, 80)}...`);
    });
    console.log('');
  });
}

// Exemplos de uso
buscarQuestoes('DevOps');
buscarQuestoes('LGPD', { type: 'objective' });
buscarQuestoes('segurança', { courseSlug: 'seguranca-da-informacao' });
```

---

### 6. Gerador de Simulado Personalizado

```javascript
async function simuladoPersonalizado(config) {
  const {
    materias = [],      // Array de slugs de matérias
    porMateria = 5,     // Questões por matéria
    tipo = null,        // 'objective' ou 'discursive'
    origem = 'both'     // 'quizzes', 'exams' ou 'both'
  } = config;
  
  console.log('\n🎯 Gerando Simulado Personalizado...\n');
  
  const todasQuestoes = [];
  
  for (const materia of materias) {
    const response = await fetch('http://localhost:3000/api/quiz/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseSlug: materia,
        limit: porMateria,
        type: tipo,
        source: origem,
        shuffle: true
      })
    });
    
    const { quiz } = await response.json();
    
    console.log(`✅ ${quiz.courseName}: ${quiz.totalQuestions} questões`);
    
    todasQuestoes.push(...quiz.questions.map(q => ({
      ...q,
      materia: quiz.courseName
    })));
  }
  
  // Embaralhar todas as questões
  const embaralhado = todasQuestoes.sort(() => Math.random() - 0.5);
  
  console.log(`\n📊 Total: ${embaralhado.length} questões`);
  console.log(`\n${'='.repeat(80)}\n`);
  
  embaralhado.forEach((q, i) => {
    console.log(`${i + 1}. [${q.materia}] ${q.question.substring(0, 70)}...`);
  });
  
  return embaralhado;
}

// Uso
simuladoPersonalizado({
  materias: [
    'arquitetura-de-sistemas',
    'seguranca-da-informacao',
    'governanca-de-tecnologia-da-informacao'
  ],
  porMateria: 3,
  tipo: 'objective',
  origem: 'both'
});
```

---

### 7. Exportar Questões para JSON

```javascript
async function exportarQuestoes(materia, filename) {
  const response = await fetch(
    `http://localhost:3000/api/courses/${materia}?includeQuestions=true`
  );
  const { data } = await response.json();
  
  const fs = require('fs');
  const exportData = {
    materia: data.name,
    totalQuestoes: data.totalQuestions,
    dataExportacao: new Date().toISOString(),
    questoes: {
      atividades: data.quizzes,
      provas: data.exams
    }
  };
  
  fs.writeFileSync(filename, JSON.stringify(exportData, null, 2));
  
  console.log(`✅ Questões exportadas para: ${filename}`);
  console.log(`📊 Total: ${data.totalQuestions} questões`);
}

// Uso
exportarQuestoes('arquitetura-de-sistemas', 'questoes-exportadas.json');
```

---

## 🎨 Integração com Frontend

### React Hooks

```javascript
// useQuiz.js
import { useState, useEffect } from 'react';

export function useQuiz(courseSlug, limit = 10) {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchQuiz() {
      try {
        const response = await fetch('http://localhost:3000/api/quiz/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ courseSlug, limit, shuffle: true })
        });
        
        const data = await response.json();
        setQuiz(data.quiz);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchQuiz();
  }, [courseSlug, limit]);

  return { quiz, loading, error };
}

// Uso no componente
function QuizComponent() {
  const { quiz, loading, error } = useQuiz('arquitetura-de-sistemas', 10);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      <h1>{quiz.courseName}</h1>
      <p>Total: {quiz.totalQuestions} questões</p>
      {/* Renderizar questões */}
    </div>
  );
}
```

---

## 💡 Próximos Passos

- [Exemplos com Imagens](./imagens.md) - Trabalhar com questões que têm imagens
- [Referência Completa](../referencia/tipos.md) - Tipos de dados e estruturas
- [Códigos de Erro](../referencia/erros.md) - Tratamento de erros

