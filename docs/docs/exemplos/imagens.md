---
sidebar_position: 2
---

# Exemplos com Imagens

Trabalhando com questões que possuem imagens.

## 📸 Visão Geral

A API possui **2 questões com imagens**:
- **Empreendorismo**: 1 questão (`Img_perguntas/Empren1.png`)
- **Gestão de Projetos de Software**: 1 questão (`Img_perguntas/GPS1.png`)

As imagens estão localizadas em `public/images/` no servidor.

---

## 🔍 Descobrir Questões com Imagens

### Verificar Estatísticas

```javascript
async function verificarQuestoesComImagens() {
  const response = await fetch('http://localhost:3000/api/courses/stats');
  const { data } = await response.json();
  
  console.log(`📊 Total de questões com imagens: ${data.questionsWithImages}\n`);
  
  // Filtrar matérias que têm questões com imagens
  const comImagens = data.courseBreakdown
    .filter(course => course.questionsWithImages > 0);
  
  console.log('📚 Matérias com questões com imagens:\n');
  comImagens.forEach(course => {
    console.log(`   ${course.name}: ${course.questionsWithImages} questão(ões)`);
  });
}

verificarQuestoesComImagens();
```

**Output:**
```
📊 Total de questões com imagens: 2

📚 Matérias com questões com imagens:
   Empreendorismo: 1 questão(ões)
   Gestão de Projetos de Software: 1 questão(ões)
```

---

## 📥 Buscar Questões com Imagens

### Por Matéria Específica

```javascript
async function buscarQuestoesComImagens(materia) {
  const response = await fetch(
    `http://localhost:3000/api/courses/${materia}/quizzes?hasImage=true`
  );
  const data = await response.json();
  
  console.log(`🖼️  Questões com imagens em ${materia}:\n`);
  console.log(`Total: ${data.count}\n`);
  
  data.data.forEach((q, i) => {
    console.log(`${i + 1}. ${q.question.substring(0, 80)}...`);
    console.log(`   Tipo: ${q.type}`);
    console.log(`   Imagem: ${q.image}`);
    console.log(`   Resposta: ${q.answer.substring(0, 60)}...\n`);
  });
  
  return data.data;
}

// Uso
buscarQuestoesComImagens('empreendorismo');
buscarQuestoesComImagens('gestao-de-projetos-de-software');
```

---

### Buscar TODAS as Questões com Imagens

```javascript
async function buscarTodasQuestoesComImagens() {
  // 1. Obter estatísticas
  const statsResponse = await fetch('http://localhost:3000/api/courses/stats');
  const { data: stats } = await statsResponse.json();
  
  // 2. Filtrar matérias com imagens
  const materiasComImagens = stats.courseBreakdown
    .filter(course => course.questionsWithImages > 0);
  
  // 3. Buscar questões de cada matéria
  const todasQuestoes = [];
  
  for (const materia of materiasComImagens) {
    const response = await fetch(
      `http://localhost:3000/api/courses/${materia.slug}/quizzes?hasImage=true`
    );
    const { data } = await response.json();
    
    data.forEach(q => {
      todasQuestoes.push({
        ...q,
        materia: materia.name,
        materiaSlug: materia.slug
      });
    });
  }
  
  console.log(`\n🖼️  Total de questões com imagens: ${todasQuestoes.length}\n`);
  
  todasQuestoes.forEach((q, i) => {
    console.log(`${i + 1}. [${q.materia}]`);
    console.log(`   Questão: ${q.question.substring(0, 80)}...`);
    console.log(`   Imagem: ${q.image}`);
    console.log(`   Tipo: ${q.type}\n`);
  });
  
  return todasQuestoes;
}

buscarTodasQuestoesComImagens();
```

---

## 🎲 Gerar Simulado com Imagens

### Apenas Questões com Imagens

```javascript
async function gerarSimuladoComImagens(materia) {
  const response = await fetch('http://localhost:3000/api/quiz/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      courseSlug: materia,
      hasImage: true,  // ⭐ Filtro principal
      limit: 10,
      shuffle: true
    })
  });
  
  const { quiz } = await response.json();
  
  console.log(`\n🎯 Simulado: ${quiz.courseName}`);
  console.log(`🖼️  Questões com imagens: ${quiz.totalQuestions}\n`);
  
  quiz.questions.forEach((q, i) => {
    console.log(`${i + 1}. ${q.question.substring(0, 70)}...`);
    console.log(`   Imagem: ${q.image}`);
    console.log(`   Tipo: ${q.type}`);
    console.log(`   Resposta: ${q.answer.substring(0, 50)}...\n`);
  });
  
  return quiz;
}

// Uso
gerarSimuladoComImagens('empreendorismo');
```

---

### Simulado Misto (Com e Sem Imagens)

```javascript
async function gerarSimuladoMisto(materia, totalQuestoes = 10) {
  // Buscar todas as questões da matéria
  const response = await fetch('http://localhost:3000/api/quiz/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      courseSlug: materia,
      limit: totalQuestoes,
      shuffle: true
      // Sem filtro hasImage - pega todas
    })
  });
  
  const { quiz } = await response.json();
  
  const comImagem = quiz.questions.filter(q => q.image !== null);
  const semImagem = quiz.questions.filter(q => q.image === null);
  
  console.log(`\n📊 Simulado Misto: ${quiz.courseName}`);
  console.log(`   Total: ${quiz.totalQuestions} questões`);
  console.log(`   Com imagem: ${comImagem.length}`);
  console.log(`   Sem imagem: ${semImagem.length}\n`);
  
  return quiz;
}

gerarSimuladoMisto('empreendorismo', 20);
```

---

## 🎨 Exibir Imagens no Frontend

### HTML Puro

```html
<!DOCTYPE html>
<html>
<head>
  <title>Quiz com Imagens</title>
  <style>
    .question-image {
      max-width: 500px;
      margin: 20px 0;
      border: 2px solid #ddd;
      border-radius: 8px;
    }
  </style>
</head>
<body>
  <div id="quiz-container"></div>

  <script>
    async function carregarQuiz() {
      const response = await fetch('http://localhost:3000/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseSlug: 'empreendorismo',
          hasImage: true
        })
      });
      
      const { quiz } = await response.json();
      const container = document.getElementById('quiz-container');
      
      quiz.questions.forEach((q, i) => {
        const questionDiv = document.createElement('div');
        questionDiv.innerHTML = `
          <h3>Questão ${i + 1}</h3>
          <p>${q.question}</p>
          ${q.image ? `<img src="/images/${q.image.split('/').pop()}" class="question-image" alt="Imagem da questão">` : ''}
          ${q.options.map((opt, j) => `
            <div>
              <input type="radio" name="q${i}" value="${opt.text}">
              <label>${opt.text}</label>
            </div>
          `).join('')}
        `;
        
        container.appendChild(questionDiv);
      });
    }
    
    carregarQuiz();
  </script>
</body>
</html>
```

---

### React Component

```jsx
import React, { useState, useEffect } from 'react';

function QuestionWithImage({ question, index }) {
  // Extrair apenas o nome do arquivo da imagem
  const getImagePath = (imagePath) => {
    if (!imagePath) return null;
    return `/images/${imagePath.split('/').pop()}`;
  };

  return (
    <div className="question-card">
      <h3>Questão {index + 1}</h3>
      <p>{question.question}</p>
      
      {/* Renderizar imagem se existir */}
      {question.image && (
        <img 
          src={getImagePath(question.image)} 
          alt="Imagem da questão"
          className="question-image"
          style={{
            maxWidth: '500px',
            margin: '20px 0',
            borderRadius: '8px',
            border: '2px solid #ddd'
          }}
        />
      )}
      
      {/* Opções de resposta */}
      {question.type === 'objective' && (
        <div className="options">
          {question.options.map((option, i) => (
            <label key={i} className="option">
              <input 
                type="radio" 
                name={`question-${index}`}
                value={option.text}
              />
              {option.text}
            </label>
          ))}
        </div>
      )}
    </div>
  );
}

function QuizWithImages() {
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadQuiz() {
      const response = await fetch('http://localhost:3000/api/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseSlug: 'empreendorismo',
          hasImage: true,
          limit: 10
        })
      });
      
      const data = await response.json();
      setQuiz(data.quiz);
      setLoading(false);
    }

    loadQuiz();
  }, []);

  if (loading) return <div>Carregando quiz...</div>;

  return (
    <div className="quiz-container">
      <h1>{quiz.courseName}</h1>
      <p>Total de questões: {quiz.totalQuestions}</p>
      
      {quiz.questions.map((question, index) => (
        <QuestionWithImage 
          key={index}
          question={question}
          index={index}
        />
      ))}
    </div>
  );
}

export default QuizWithImages;
```

---

### Vue Component

```vue
<template>
  <div class="quiz-container">
    <h1>{{ quiz?.courseName }}</h1>
    <p v-if="quiz">Total de questões: {{ quiz.totalQuestions }}</p>
    
    <div v-for="(question, index) in quiz?.questions" :key="index" class="question-card">
      <h3>Questão {{ index + 1 }}</h3>
      <p>{{ question.question }}</p>
      
      <!-- Imagem se existir -->
      <img 
        v-if="question.image"
        :src="`/images/${getImageName(question.image)}`"
        alt="Imagem da questão"
        class="question-image"
      />
      
      <!-- Opções -->
      <div v-if="question.type === 'objective'" class="options">
        <label v-for="(option, i) in question.options" :key="i">
          <input 
            type="radio" 
            :name="`question-${index}`"
            :value="option.text"
          />
          {{ option.text }}
        </label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      quiz: null
    };
  },
  
  async mounted() {
    const response = await fetch('http://localhost:3000/api/quiz/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseSlug: 'empreendorismo',
        hasImage: true
      })
    });
    
    const data = await response.json();
    this.quiz = data.quiz;
  },
  
  methods: {
    getImageName(imagePath) {
      return imagePath.split('/').pop();
    }
  }
};
</script>

<style scoped>
.question-image {
  max-width: 500px;
  margin: 20px 0;
  border-radius: 8px;
  border: 2px solid #ddd;
}

.question-card {
  margin-bottom: 40px;
  padding: 20px;
  border: 1px solid #eee;
  border-radius: 8px;
}

.options label {
  display: block;
  margin: 10px 0;
}
</style>
```

---

## 📱 Exemplo Completo: App de Quiz

```javascript
class QuizComImagensApp {
  constructor() {
    this.todasQuestoes = [];
    this.quizAtual = null;
  }
  
  async initialize() {
    // Buscar todas as questões com imagens
    const stats = await fetch('http://localhost:3000/api/courses/stats')
      .then(r => r.json());
    
    const materiasComImagens = stats.data.courseBreakdown
      .filter(c => c.questionsWithImages > 0);
    
    for (const materia of materiasComImagens) {
      const response = await fetch(
        `http://localhost:3000/api/courses/${materia.slug}/quizzes?hasImage=true`
      );
      const { data } = await response.json();
      
      this.todasQuestoes.push(...data.map(q => ({
        ...q,
        materia: materia.name,
        materiaId: materia.id
      })));
    }
    
    console.log(`✅ ${this.todasQuestoes.length} questões com imagens carregadas`);
    return this;
  }
  
  gerarQuiz(quantidade = 2) {
    const shuffled = [...this.todasQuestoes].sort(() => Math.random() - 0.5);
    this.quizAtual = shuffled.slice(0, quantidade);
    
    console.log(`\n🎯 Quiz gerado com ${this.quizAtual.length} questões\n`);
    return this.quizAtual;
  }
  
  mostrarQuestao(index) {
    const q = this.quizAtual[index];
    
    console.log(`\n${'='.repeat(80)}`);
    console.log(`Questão ${index + 1}/${this.quizAtual.length} - ${q.materia}`);
    console.log(`${'='.repeat(80)}\n`);
    console.log(q.question);
    console.log(`\n🖼️  Imagem: ${q.image}\n`);
    
    if (q.type === 'objective') {
      q.options.forEach((opt, i) => {
        console.log(`${String.fromCharCode(65 + i)}) ${opt.text}`);
      });
    } else {
      console.log('[Questão Discursiva - Resposta livre]');
    }
    
    console.log(`\n💡 Resposta: ${q.answer}\n`);
  }
  
  exibirTodasQuestoes() {
    this.quizAtual.forEach((q, i) => this.mostrarQuestao(i));
  }
}

// Uso
async function testarApp() {
  const app = await new QuizComImagensApp().initialize();
  const quiz = app.gerarQuiz(2);
  app.exibirTodasQuestoes();
}

testarApp();
```

---

## 💡 Dicas Importantes

### 1. Caminho das Imagens

As imagens estão em `public/images/`, então no frontend use:

```javascript
// ❌ Errado
<img src={question.image} />  // "Img_perguntas/Empren1.png"

// ✅ Correto
<img src={`/images/${question.image.split('/').pop()}`} />  // "/images/Empren1.png"
```

### 2. Verificar se Imagem Existe

```javascript
function renderImage(question) {
  if (!question.image) return null;
  
  return (
    <img 
      src={`/images/${question.image.split('/').pop()}`}
      alt="Imagem da questão"
      onError={(e) => {
        e.target.style.display = 'none';
        console.error('Imagem não encontrada:', question.image);
      }}
    />
  );
}
```

### 3. Lazy Loading de Imagens

```html
<img 
  src={imagePath}
  loading="lazy"
  alt="Imagem da questão"
/>
```

---

## 🔗 Links Úteis

- [Endpoints - Courses](../endpoints/courses.md) - Filtrar questões por imagem
- [Endpoints - Quiz](../endpoints/quiz.md) - Gerar simulados com imagens
- [Exemplos Básicos](./basico.md) - Outros exemplos de código

