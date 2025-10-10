---
sidebar_position: 1
---

# Endpoints - Courses

Gerenciamento de matérias e questões.

## Base URL
```
http://localhost:3000/api/courses
```

---

## GET `/api/courses`

Lista todas as matérias disponíveis.

### Request

```http
GET /api/courses
```

### Response

```json
{
  "success": true,
  "count": 8,
  "data": [
    {
      "id": 1,
      "name": "Arquitetura de Sistemas",
      "slug": "arquitetura-de-sistemas",
      "totalQuizQuestions": 50,
      "totalExamQuestions": 11,
      "totalQuestions": 61
    },
    {
      "id": 2,
      "name": "Aspectos Legais da Tecnologia da Informação",
      "slug": "aspectos-legais-da-tecnologia-da-informacao",
      "totalQuizQuestions": 0,
      "totalExamQuestions": 65,
      "totalQuestions": 65
    }
    // ... outras matérias
  ]
}
```

### Exemplo JavaScript

```javascript
const courses = await fetch('http://localhost:3000/api/courses')
  .then(res => res.json());

console.log(`Total de matérias: ${courses.count}`);
courses.data.forEach(course => {
  console.log(`${course.name} - ${course.totalQuestions} questões`);
});
```

---

## GET `/api/courses/stats`

Obtém estatísticas detalhadas de todas as matérias e questões.

### Request

```http
GET /api/courses/stats
```

### Response

```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "lastUpdated": "2025-10-10T01:18:12.819Z",
    "totalCourses": 8,
    "totalQuestions": 296,
    "totalQuizQuestions": 220,
    "totalExamQuestions": 76,
    "objectiveQuestions": 253,
    "discursiveQuestions": 43,
    "questionsWithImages": 2,
    "courseBreakdown": [
      {
        "id": 1,
        "name": "Arquitetura de Sistemas",
        "slug": "arquitetura-de-sistemas",
        "totalQuestions": 61,
        "quizQuestions": 50,
        "examQuestions": 11,
        "objectiveQuestions": 50,
        "discursiveQuestions": 11,
        "questionsWithImages": 0
      }
      // ... outras matérias
    ]
  }
}
```

### Exemplo JavaScript

```javascript
const stats = await fetch('http://localhost:3000/api/courses/stats')
  .then(res => res.json());

console.log(`📊 Estatísticas Gerais:`);
console.log(`Total de questões: ${stats.data.totalQuestions}`);
console.log(`Questões objetivas: ${stats.data.objectiveQuestions}`);
console.log(`Questões discursivas: ${stats.data.discursiveQuestions}`);
console.log(`Questões com imagens: ${stats.data.questionsWithImages}`);

// Ver matérias com mais questões
const sorted = stats.data.courseBreakdown
  .sort((a, b) => b.totalQuestions - a.totalQuestions);

console.log(`\nTop 3 matérias com mais questões:`);
sorted.slice(0, 3).forEach((course, i) => {
  console.log(`${i + 1}. ${course.name}: ${course.totalQuestions} questões`);
});
```

---

## GET `/api/courses/:identifier`

Obtém informações detalhadas de uma matéria específica.

### Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `identifier` | string | ID, slug ou nome da matéria |

### Query Parameters

| Parâmetro | Tipo | Padrão | Descrição |
|-----------|------|--------|-----------|
| `includeQuestions` | boolean | false | Se `true`, inclui todas as questões |

### Request

```http
# Por ID
GET /api/courses/1

# Por slug
GET /api/courses/arquitetura-de-sistemas

# Por nome
GET /api/courses/Arquitetura de Sistemas

# Com questões incluídas
GET /api/courses/1?includeQuestions=true
```

### Response (sem questões)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Arquitetura de Sistemas",
    "slug": "arquitetura-de-sistemas",
    "totalQuizQuestions": 50,
    "totalExamQuestions": 11,
    "totalQuestions": 61
  }
}
```

### Response (com questões)

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Arquitetura de Sistemas",
    "slug": "arquitetura-de-sistemas",
    "totalQuizQuestions": 50,
    "totalExamQuestions": 11,
    "totalQuestions": 61,
    "quizzes": [
      {
        "question": "Qual das alternativas...",
        "type": "objective",
        "options": [...],
        "answer": "Resposta correta",
        "image": null
      }
      // ... todas as questões de atividades
    ],
    "exams": [
      // ... todas as questões de provas
    ]
  }
}
```

### Exemplo JavaScript

```javascript
// Buscar matéria por slug
const course = await fetch('http://localhost:3000/api/courses/arquitetura-de-sistemas')
  .then(res => res.json());

console.log(`Matéria: ${course.data.name}`);
console.log(`Total de questões: ${course.data.totalQuestions}`);

// Buscar com questões incluídas
const courseWithQuestions = await fetch(
  'http://localhost:3000/api/courses/1?includeQuestions=true'
).then(res => res.json());

console.log(`Questões de atividades: ${courseWithQuestions.data.quizzes.length}`);
console.log(`Questões de provas: ${courseWithQuestions.data.exams.length}`);
```

---

## GET `/api/courses/:identifier/quizzes`

Obtém todas as questões de **atividades** de uma matéria.

### Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `identifier` | string | ID, slug ou nome da matéria |

### Query Parameters

| Parâmetro | Tipo | Valores | Descrição |
|-----------|------|---------|-----------|
| `type` | string | `objective`, `discursive` | Filtrar por tipo de questão |
| `hasImage` | boolean | `true`, `false` | Filtrar questões com/sem imagem |

### Request

```http
# Todas as questões de atividades
GET /api/courses/1/quizzes

# Apenas questões objetivas
GET /api/courses/arquitetura-de-sistemas/quizzes?type=objective

# Apenas questões discursivas
GET /api/courses/1/quizzes?type=discursive

# Apenas questões com imagens
GET /api/courses/empreendorismo/quizzes?hasImage=true

# Questões objetivas COM imagens
GET /api/courses/empreendorismo/quizzes?type=objective&hasImage=true
```

### Response

```json
{
  "success": true,
  "count": 50,
  "filters": {
    "type": "objective"
  },
  "data": [
    {
      "question": "Qual das alternativas abaixo melhor descreve o conceito de DevOps?",
      "type": "objective",
      "options": [
        { "text": "Uma metodologia exclusivamente voltada para desenvolvedores." },
        { "text": "Uma abordagem que integra desenvolvimento e operações..." }
      ],
      "answer": "Uma abordagem que integra desenvolvimento e operações...",
      "image": null
    }
    // ... outras questões
  ]
}
```

### Exemplo JavaScript

```javascript
// Buscar questões objetivas
const quizzes = await fetch(
  'http://localhost:3000/api/courses/1/quizzes?type=objective'
).then(res => res.json());

console.log(`Total de questões objetivas: ${quizzes.count}`);

quizzes.data.forEach((q, i) => {
  console.log(`\n${i + 1}. ${q.question}`);
  console.log(`Opções: ${q.options.length}`);
  console.log(`Resposta: ${q.answer}`);
});

// Buscar apenas questões com imagens
const withImages = await fetch(
  'http://localhost:3000/api/courses/empreendorismo/quizzes?hasImage=true'
).then(res => res.json());

console.log(`Questões com imagens: ${withImages.count}`);
```

---

## GET `/api/courses/:identifier/exams`

Obtém todas as questões de **provas** de uma matéria.

### Parâmetros

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `identifier` | string | ID, slug ou nome da matéria |

### Query Parameters

| Parâmetro | Tipo | Valores | Descrição |
|-----------|------|---------|-----------|
| `type` | string | `objective`, `discursive` | Filtrar por tipo de questão |
| `hasImage` | boolean | `true`, `false` | Filtrar questões com/sem imagem |

### Request

```http
# Todas as questões de provas
GET /api/courses/2/exams

# Apenas questões objetivas de provas
GET /api/courses/aspectos-legais-da-tecnologia-da-informacao/exams?type=objective

# Apenas questões discursivas de provas
GET /api/courses/2/exams?type=discursive
```

### Response

```json
{
  "success": true,
  "count": 65,
  "filters": {},
  "data": [
    {
      "question": "A ANPD (Agência Nacional de Proteção aos Dados)...",
      "type": "objective",
      "options": [
        { "text": "Somente I e III estão corretas." },
        { "text": "Todas estão corretas." }
      ],
      "answer": "Somente I e III estão corretas.",
      "image": null
    }
    // ... outras questões
  ]
}
```

### Exemplo JavaScript

```javascript
// Buscar questões de provas
const exams = await fetch(
  'http://localhost:3000/api/courses/2/exams'
).then(res => res.json());

console.log(`Total de questões de provas: ${exams.count}`);

// Separar por tipo
const objective = exams.data.filter(q => q.type === 'objective');
const discursive = exams.data.filter(q => q.type === 'discursive');

console.log(`Objetivas: ${objective.length}`);
console.log(`Discursivas: ${discursive.length}`);
```

---

## ❌ Erros Comuns

### 404 - Course Not Found

```json
{
  "success": false,
  "error": "Course not found"
}
```

**Causa:** ID, slug ou nome da matéria não existe.

**Solução:** Verifique a lista de matérias em `/api/courses`.

---

## 💡 Dicas de Uso

### 1. Use slugs para URLs amigáveis
```javascript
// ✅ Recomendado
fetch('/api/courses/arquitetura-de-sistemas/quizzes')

// ⚠️ Funciona, mas menos legível
fetch('/api/courses/1/quizzes')
```

### 2. Combine filtros para buscas específicas
```javascript
// Buscar apenas questões objetivas sem imagens
fetch('/api/courses/1/quizzes?type=objective&hasImage=false')
```

### 3. Use stats para overview geral
```javascript
// Ver todas as estatísticas de uma vez
const stats = await fetch('/api/courses/stats').then(r => r.json());

// Encontrar matérias com questões com imagens
const withImages = stats.data.courseBreakdown
  .filter(c => c.questionsWithImages > 0);
```

