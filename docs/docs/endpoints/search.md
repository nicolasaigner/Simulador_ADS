---
sidebar_position: 3
---

# Endpoints - Search

Busca inteligente de questões por texto.

## Base URL
```
http://localhost:3000/api/search
```

---

## GET `/api/search`

Busca questões por palavra-chave ou texto.

### Query Parameters

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `q` | string | **Obrigatório** - Texto de busca (mínimo 3 caracteres) |
| `courseId` | number | Filtrar por ID da matéria |
| `courseSlug` | string | Filtrar por slug da matéria |
| `type` | string | Filtrar por tipo: `objective`, `discursive` |
| `source` | string | Filtrar por origem: `quizzes`, `exams` |

### Request

```http
# Busca simples
GET /api/search?q=DevOps

# Busca em matéria específica
GET /api/search?q=DevOps&courseId=1

# Busca por tipo
GET /api/search?q=segurança&type=objective

# Busca combinada
GET /api/search?q=LGPD&courseSlug=aspectos-legais-da-tecnologia-da-informacao&type=objective
```

### Response

```json
{
  "success": true,
  "query": "DevOps",
  "filters": {
    "type": "objective"
  },
  "count": 25,
  "data": [
    {
      "question": "Qual das alternativas abaixo melhor descreve o conceito de DevOps?",
      "type": "objective",
      "options": [
        { "text": "Uma metodologia exclusivamente voltada para desenvolvedores." },
        { "text": "Uma abordagem que integra desenvolvimento e operações..." }
      ],
      "answer": "Uma abordagem que integra desenvolvimento e operações...",
      "image": null,
      "courseId": 1,
      "courseName": "Arquitetura de Sistemas",
      "courseSlug": "arquitetura-de-sistemas",
      "questionIndex": 0
    }
    // ... outras questões
  ]
}
```

---

## Exemplos de Uso

### Busca Simples

```javascript
const results = await fetch('http://localhost:3000/api/search?q=DevOps')
  .then(res => res.json());

console.log(`Encontradas ${results.count} questões sobre "${results.query}"`);

results.data.forEach((q, i) => {
  console.log(`\n${i + 1}. [${q.courseName}] ${q.question.substring(0, 60)}...`);
  console.log(`   Tipo: ${q.type}`);
});
```

### Busca por Matéria

```javascript
// Buscar "LGPD" apenas em Aspectos Legais
const lgpdQuestions = await fetch(
  'http://localhost:3000/api/search?q=LGPD&courseSlug=aspectos-legais-da-tecnologia-da-informacao'
).then(res => res.json());

console.log(`Questões sobre LGPD: ${lgpdQuestions.count}`);
```

### Busca por Tipo

```javascript
// Buscar apenas questões objetivas sobre "redes"
const objectiveQuestions = await fetch(
  'http://localhost:3000/api/search?q=redes&type=objective'
).then(res => res.json());

console.log(`Questões objetivas sobre redes: ${objectiveQuestions.count}`);
```

### Busca em Provas

```javascript
// Buscar apenas em questões de provas
const examQuestions = await fetch(
  'http://localhost:3000/api/search?q=governança&source=exams'
).then(res => res.json());

console.log(`Questões de provas sobre governança: ${examQuestions.count}`);
```

### Busca Avançada com Filtros Múltiplos

```javascript
// Busca super específica
const results = await fetch(
  'http://localhost:3000/api/search?' + new URLSearchParams({
    q: 'segurança',
    courseId: '8',
    type: 'objective',
    source: 'quizzes'
  })
).then(res => res.json());

console.log(`Resultados filtrados: ${results.count}`);
console.log(`Filtros aplicados:`, results.filters);
```

---

## Casos de Uso Práticos

### 1. Autocomplete de Busca

```javascript
async function searchAutocomplete(term) {
  if (term.length < 3) return [];
  
  const results = await fetch(`http://localhost:3000/api/search?q=${term}`)
    .then(res => res.json());
  
  return results.data.map(q => ({
    text: q.question.substring(0, 100) + '...',
    course: q.courseName,
    type: q.type
  }));
}

// Uso
const suggestions = await searchAutocomplete('DevOps');
console.log(suggestions);
```

### 2. Estatísticas de Busca

```javascript
async function searchStats(query) {
  const results = await fetch(`http://localhost:3000/api/search?q=${query}`)
    .then(res => res.json());
  
  const stats = {
    total: results.count,
    byType: {
      objective: results.data.filter(q => q.type === 'objective').length,
      discursive: results.data.filter(q => q.type === 'discursive').length
    },
    byCourse: {}
  };
  
  results.data.forEach(q => {
    if (!stats.byCourse[q.courseName]) {
      stats.byCourse[q.courseName] = 0;
    }
    stats.byCourse[q.courseName]++;
  });
  
  return stats;
}

// Uso
const stats = await searchStats('DevOps');
console.log('Total:', stats.total);
console.log('Objetivas:', stats.byType.objective);
console.log('Discursivas:', stats.byType.discursive);
console.log('Por matéria:', stats.byCourse);
```

### 3. Criar Quiz Temático

```javascript
// Criar um quiz sobre um tema específico
async function createThematicQuiz(theme, limit = 10) {
  const results = await fetch(`http://localhost:3000/api/search?q=${theme}`)
    .then(res => res.json());
  
  if (results.count === 0) {
    throw new Error(`Nenhuma questão encontrada sobre "${theme}"`);
  }
  
  // Embaralhar e limitar
  const shuffled = results.data.sort(() => Math.random() - 0.5);
  const questions = shuffled.slice(0, limit);
  
  return {
    theme,
    totalQuestions: questions.length,
    questions
  };
}

// Uso
const devOpsQuiz = await createThematicQuiz('DevOps', 15);
console.log(`Quiz sobre ${devOpsQuiz.theme}: ${devOpsQuiz.totalQuestions} questões`);
```

### 4. Busca Multi-Termos

```javascript
async function multiTermSearch(terms) {
  const allResults = await Promise.all(
    terms.map(term => 
      fetch(`http://localhost:3000/api/search?q=${term}`).then(r => r.json())
    )
  );
  
  // Combinar e remover duplicatas
  const combined = new Map();
  
  allResults.forEach(result => {
    result.data.forEach(q => {
      const key = `${q.courseId}-${q.questionIndex}`;
      if (!combined.has(key)) {
        combined.set(key, q);
      }
    });
  });
  
  return Array.from(combined.values());
}

// Buscar questões sobre "DevOps" OU "CI/CD"
const results = await multiTermSearch(['DevOps', 'CI/CD']);
console.log(`Total de questões: ${results.length}`);
```

---

## ❌ Erros Comuns

### 400 - Query Required

```json
{
  "success": false,
  "error": "Query parameter \"q\" is required"
}
```

**Solução:** Adicione o parâmetro `q` na URL.

### 400 - Query Too Short

```json
{
  "success": false,
  "error": "Query must be at least 3 characters long"
}
```

**Solução:** Use termos de busca com 3 ou mais caracteres.

---

## 💡 Dicas de Busca

### 1. Use Termos Específicos

```javascript
// ✅ Bom - termo específico
/api/search?q=DevOps

// ⚠️ Menos efetivo - termo muito genérico
/api/search?q=o
```

### 2. Busca Case-Insensitive

A busca não diferencia maiúsculas de minúsculas:

```javascript
// Todos retornam os mesmos resultados
/api/search?q=DevOps
/api/search?q=devops
/api/search?q=DEVOPS
```

### 3. Busca em Perguntas E Respostas

A busca procura tanto nas perguntas quanto nas respostas:

```javascript
// Encontra questões que tenham "LGPD" na pergunta OU na resposta
/api/search?q=LGPD
```

### 4. Combine com Outros Endpoints

```javascript
// 1. Buscar questões
const search = await fetch('/api/search?q=DevOps').then(r => r.json());

// 2. Agrupar por matéria
const byCourse = {};
search.data.forEach(q => {
  if (!byCourse[q.courseId]) {
    byCourse[q.courseId] = [];
  }
  byCourse[q.courseId].push(q);
});

// 3. Buscar detalhes de cada matéria
for (const courseId in byCourse) {
  const course = await fetch(`/api/courses/${courseId}`).then(r => r.json());
  console.log(`${course.data.name}: ${byCourse[courseId].length} questões`);
}
```

### 5. Paginação Manual

A API retorna todos os resultados. Implemente paginação no frontend:

```javascript
function paginateResults(results, page = 1, perPage = 10) {
  const start = (page - 1) * perPage;
  const end = start + perPage;
  
  return {
    data: results.slice(start, end),
    currentPage: page,
    totalPages: Math.ceil(results.length / perPage),
    total: results.length
  };
}

// Uso
const search = await fetch('/api/search?q=DevOps').then(r => r.json());
const page1 = paginateResults(search.data, 1, 10);
const page2 = paginateResults(search.data, 2, 10);
```
---
sidebar_position: 2
---

# Endpoints - Quiz

Geração e validação de simulados personalizados.

## Base URL
```
http://localhost:3000/api/quiz
```

---

## POST `/api/quiz/generate`

Gera um simulado personalizado com filtros avançados.

### Request Body

| Campo | Tipo | Padrão | Descrição |
|-------|------|--------|-----------|
| `courseId` | number | - | ID da matéria |
| `courseSlug` | string | - | Slug da matéria |
| `courseName` | string | - | Nome da matéria |
| `source` | string | `quizzes` | Origem: `quizzes`, `exams`, `both` |
| `limit` | number | 10 | Quantidade de questões |
| `type` | string | null | Tipo: `objective`, `discursive` |
| `hasImage` | boolean | null | Filtrar questões com/sem imagem |
| `shuffle` | boolean | true | Embaralhar questões |

:::info
Você deve fornecer **pelo menos um** dos identificadores: `courseId`, `courseSlug` ou `courseName`.
:::

### Request

```http
POST /api/quiz/generate
Content-Type: application/json

{
  "courseSlug": "arquitetura-de-sistemas",
  "source": "quizzes",
  "limit": 15,
  "type": "objective",
  "shuffle": true
}
```

### Response

```json
{
  "success": true,
  "quiz": {
    "courseId": 1,
    "courseName": "Arquitetura de Sistemas",
    "courseSlug": "arquitetura-de-sistemas",
    "source": "quizzes",
    "totalQuestions": 15,
    "filters": {
      "type": "objective",
      "hasImage": null,
      "shuffle": true
    },
    "questions": [
      {
        "index": 0,
        "question": "Qual das alternativas abaixo melhor descreve o conceito de DevOps?",
        "type": "objective",
        "options": [
          { "text": "Uma metodologia exclusivamente voltada para desenvolvedores." },
          { "text": "Uma abordagem que integra desenvolvimento e operações..." }
        ],
        "image": null,
        "answer": "Uma abordagem que integra desenvolvimento e operações..."
      }
      // ... 14 questões restantes
    ]
  }
}
```

### Exemplos

#### Simulado básico de 10 questões
```javascript
const quiz = await fetch('http://localhost:3000/api/quiz/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseSlug: 'arquitetura-de-sistemas',
    limit: 10
  })
}).then(res => res.json());

console.log(`Simulado: ${quiz.quiz.courseName}`);
console.log(`Total de questões: ${quiz.quiz.totalQuestions}`);
```

#### Simulado de provas (exams)
```javascript
const examQuiz = await fetch('http://localhost:3000/api/quiz/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseId: 2,
    source: 'exams',  // Apenas questões de provas
    limit: 20
  })
}).then(res => res.json());
```

#### Simulado misto (atividades + provas)
```javascript
const mixedQuiz = await fetch('http://localhost:3000/api/quiz/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseSlug: 'arquitetura-de-sistemas',
    source: 'both',  // Questões de atividades E provas
    limit: 30,
    shuffle: true
  })
}).then(res => res.json());
```

#### Simulado apenas discursivo
```javascript
const discursiveQuiz = await fetch('http://localhost:3000/api/quiz/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseSlug: 'empreendorismo',
    type: 'discursive',  // Apenas questões discursivas
    limit: 5
  })
}).then(res => res.json());
```

#### Simulado com questões que têm imagens
```javascript
const imageQuiz = await fetch('http://localhost:3000/api/quiz/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseSlug: 'empreendorismo',
    hasImage: true,  // Apenas questões com imagens
    limit: 10
  })
}).then(res => res.json());

console.log(`Questões com imagens: ${imageQuiz.quiz.totalQuestions}`);
imageQuiz.quiz.questions.forEach(q => {
  console.log(`Imagem: ${q.image}`);
});
```

---

## GET `/api/quiz/random`

Gera um simulado aleatório (compatibilidade retroativa).

:::caution Deprecated
Este endpoint é mantido para compatibilidade. Use `POST /api/quiz/generate` para novos projetos.
:::

### Query Parameters

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `course` | string | - | **Obrigatório** - ID, slug ou nome da matéria |
| `source` | string | `quizzes` | Origem: `quizzes`, `exams`, `both` |
| `limit` | number | 10 | Quantidade de questões |
| `type` | string | null | Tipo: `objective`, `discursive` |
| `hasImage` | boolean | null | Filtrar questões com/sem imagem |
| `shuffle` | boolean | true | Embaralhar questões |

### Request

```http
GET /api/quiz/random?course=1&limit=15&type=objective
```

### Response

```json
{
  "success": true,
  "courseId": 1,
  "courseName": "Arquitetura de Sistemas",
  "courseSlug": "arquitetura-de-sistemas",
  "source": "quizzes",
  "count": 15,
  "data": [
    {
      "index": 0,
      "question": "Qual das alternativas...",
      "type": "objective",
      "options": [...],
      "image": null,
      "answer": "Resposta correta"
    }
    // ... outras questões
  ]
}
```

### Exemplo

```javascript
const quiz = await fetch(
  'http://localhost:3000/api/quiz/random?course=arquitetura-de-sistemas&limit=10&type=objective'
).then(res => res.json());

console.log(`${quiz.count} questões geradas`);
```

---

## POST `/api/quiz/validate`

Valida as respostas de um simulado.

### Request Body

```json
{
  "answers": [
    {
      "courseId": 1,
      "questionIndex": 0,
      "userAnswer": "Resposta do usuário",
      "source": "quizzes"
    }
  ]
}
```

### Campos do Array `answers`

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `courseId` | number | ID da matéria |
| `questionIndex` | number | Índice da questão (0-based) |
| `userAnswer` | string | Resposta fornecida pelo usuário |
| `source` | string | Origem: `quizzes` ou `exams` (padrão: `quizzes`) |

### Response

```json
{
  "success": true,
  "data": {
    "total": 10,
    "correct": 7,
    "incorrect": 3,
    "percentage": "70.00",
    "results": [
      {
        "courseId": 1,
        "questionIndex": 0,
        "question": "Qual das alternativas...",
        "userAnswer": "Uma abordagem que integra desenvolvimento...",
        "correctAnswer": "Uma abordagem que integra desenvolvimento...",
        "isCorrect": true,
        "type": "objective"
      },
      {
        "courseId": 1,
        "questionIndex": 1,
        "question": "Qual dos princípios...",
        "userAnswer": "Automação dos processos.",
        "correctAnswer": "Foco exclusivo na equipe de desenvolvimento.",
        "isCorrect": false,
        "type": "objective"
      }
      // ... outras respostas
    ]
  }
}
```

### Exemplo Completo

```javascript
// 1. Gerar simulado
const quiz = await fetch('http://localhost:3000/api/quiz/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseSlug: 'arquitetura-de-sistemas',
    limit: 5,
    type: 'objective'
  })
}).then(res => res.json());

// 2. Usuário responde as questões
const userAnswers = [
  {
    courseId: quiz.quiz.courseId,
    questionIndex: 0,
    userAnswer: "Uma abordagem que integra desenvolvimento e operações...",
    source: "quizzes"
  },
  {
    courseId: quiz.quiz.courseId,
    questionIndex: 1,
    userAnswer: "Foco exclusivo na equipe de desenvolvimento.",
    source: "quizzes"
  }
  // ... outras respostas
];

// 3. Validar respostas
const validation = await fetch('http://localhost:3000/api/quiz/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ answers: userAnswers })
}).then(res => res.json());

console.log(`Acertos: ${validation.data.correct}/${validation.data.total}`);
console.log(`Percentual: ${validation.data.percentage}%`);

// 4. Mostrar resultados detalhados
validation.data.results.forEach((result, i) => {
  console.log(`\n${i + 1}. ${result.isCorrect ? '✅' : '❌'} ${result.question.substring(0, 50)}...`);
  console.log(`   Sua resposta: ${result.userAnswer}`);
  if (!result.isCorrect) {
    console.log(`   Resposta correta: ${result.correctAnswer}`);
  }
});
```

---

## ❌ Erros Comuns

### 400 - Missing Course Identifier

```json
{
  "success": false,
  "error": "Course identifier is required (courseId, courseSlug, or courseName)"
}
```

**Solução:** Forneça pelo menos um identificador da matéria.

### 404 - Course Not Found

```json
{
  "success": false,
  "error": "Course not found"
}
```

**Solução:** Verifique se o identificador da matéria está correto.

### 404 - No Questions Found

```json
{
  "success": false,
  "error": "No questions found matching the criteria"
}
```

**Solução:** Os filtros aplicados não retornaram questões. Tente remover alguns filtros.

### 400 - Invalid Answers Array

```json
{
  "success": false,
  "error": "Answers must be an array of objects with structure: { courseId, questionIndex, userAnswer, source }"
}
```

**Solução:** Verifique a estrutura do array de respostas.

---

## 💡 Dicas de Uso

### 1. Validação Local vs Servidor

Você pode validar respostas **localmente** (já que a API retorna as respostas corretas):

```javascript
// Validação local (mais rápido)
const isCorrect = userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim();

// OU validação no servidor (mais seguro)
const validation = await fetch('/api/quiz/validate', {...});
```

### 2. Combinar Filtros

```javascript
// Simulado de 20 questões objetivas de provas
{
  courseSlug: 'aspectos-legais-da-tecnologia-da-informacao',
  source: 'exams',
  type: 'objective',
  limit: 20
}
```

### 3. Ordem das Questões

Use `shuffle: false` para manter a ordem original:

```javascript
{
  courseSlug: 'arquitetura-de-sistemas',
  shuffle: false  // Questões na ordem original
}
```

### 4. Simulado Personalizado por Matéria

```javascript
// Verificar quantas questões cada matéria tem
const stats = await fetch('/api/courses/stats').then(r => r.json());

// Gerar simulado proporcional ao número de questões
stats.data.courseBreakdown.forEach(async course => {
  const quiz = await fetch('/api/quiz/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      courseId: course.id,
      limit: Math.min(course.totalQuestions, 10)
    })
  }).then(r => r.json());
  
  console.log(`${course.name}: ${quiz.quiz.totalQuestions} questões`);
});
```

