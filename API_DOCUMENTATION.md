# Simulador ADS - API Documentation

## 📚 Overview

API RESTful para simulador de provas e atividades das matérias do curso de Análise e Desenvolvimento de Sistemas.

**Base URL:** `http://localhost:3000`

---

## 🚀 Endpoints

### **Health Check**

#### GET `/health`
Verifica o status da API.

**Response:**
```json
{
  "status": "ok",
  "message": "Simulador ADS API is running"
}
```

---

### **Courses (Matérias)**

#### GET `/api/courses`
Lista todas as matérias disponíveis.

**Response:**
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
    }
  ]
}
```

---

#### GET `/api/courses/stats`
Obtém estatísticas gerais sobre as questões.

**Response:**
```json
{
  "success": true,
  "data": {
    "version": "1.0.0",
    "lastUpdated": "2025-10-09T...",
    "totalCourses": 8,
    "totalQuestions": 296,
    "totalQuizQuestions": 220,
    "totalExamQuestions": 76,
    "objectiveQuestions": 270,
    "discursiveQuestions": 26,
    "questionsWithImages": 4,
    "courseBreakdown": [...]
  }
}
```

---

#### GET `/api/courses/:identifier`
Obtém informações sobre uma matéria específica.

**Parâmetros:**
- `:identifier` - ID, slug ou nome da matéria

**Query Parameters:**
- `includeQuestions` (boolean) - Se `true`, inclui todas as questões

**Exemplos:**
- `/api/courses/1`
- `/api/courses/arquitetura-de-sistemas`
- `/api/courses/Arquitetura de Sistemas`

**Response:**
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

---

#### GET `/api/courses/:identifier/quizzes`
Obtém todas as questões de atividades de uma matéria.

**Query Parameters:**
- `type` (string) - Filtrar por tipo: `objective` ou `discursive`
- `hasImage` (boolean) - Filtrar questões com/sem imagem

**Exemplo:**
```
/api/courses/1/quizzes?type=objective&hasImage=true
```

**Response:**
```json
{
  "success": true,
  "count": 40,
  "filters": {
    "type": "objective"
  },
  "data": [
    {
      "question": "Qual das alternativas...",
      "type": "objective",
      "options": [...],
      "answer": "Resposta correta",
      "image": null
    }
  ]
}
```

---

#### GET `/api/courses/:identifier/exams`
Obtém todas as questões de provas de uma matéria.

**Query Parameters:**
- `type` (string) - Filtrar por tipo: `objective` ou `discursive`
- `hasImage` (boolean) - Filtrar questões com/sem imagem

---

### **Quiz (Simulados)**

#### POST `/api/quiz/generate`
Gera um simulado personalizado.

**Request Body:**
```json
{
  "courseId": 1,
  // OU "courseSlug": "arquitetura-de-sistemas",
  // OU "courseName": "Arquitetura de Sistemas",
  "source": "quizzes",
  "limit": 10,
  "type": "objective",
  "hasImage": null,
  "shuffle": true
}
```

**Parâmetros:**
- `courseId/courseSlug/courseName` (required) - Identificador da matéria
- `source` (string) - `quizzes`, `exams`, ou `both` (default: `quizzes`)
- `limit` (number) - Número de questões (default: 10)
- `type` (string) - `objective` ou `discursive` (default: null - todos)
- `hasImage` (boolean) - Apenas questões com/sem imagem (default: null - todos)
- `shuffle` (boolean) - Embaralhar questões (default: true)

**Response:**
```json
{
  "success": true,
  "quiz": {
    "courseId": 1,
    "courseName": "Arquitetura de Sistemas",
    "courseSlug": "arquitetura-de-sistemas",
    "source": "quizzes",
    "totalQuestions": 10,
    "filters": {
      "type": "objective",
      "hasImage": null,
      "shuffle": true
    },
    "questions": [
      {
        "index": 0,
        "question": "Qual das alternativas...",
        "type": "objective",
        "options": [...],
        "image": null
      }
    ]
  }
}
```

---

#### GET `/api/quiz/random`
Gera um simulado aleatório (compatibilidade retroativa).

**Query Parameters:**
- `course` (required) - ID, slug ou nome da matéria
- `source` (string) - `quizzes`, `exams`, ou `both` (default: `quizzes`)
- `limit` (number) - Número de questões (default: 10)
- `type` (string) - `objective` ou `discursive`
- `hasImage` (boolean) - Apenas questões com/sem imagem
- `shuffle` (boolean) - Embaralhar questões (default: true)

**Exemplo:**
```
/api/quiz/random?course=1&limit=15&type=objective
```

---

#### POST `/api/quiz/validate`
Valida as respostas de um simulado.

**Request Body:**
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

**Response:**
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
        "userAnswer": "Resposta do usuário",
        "correctAnswer": "Resposta correta",
        "isCorrect": true,
        "type": "objective"
      }
    ]
  }
}
```

---

### **Search (Busca)**

#### GET `/api/search`
Busca questões por texto.

**Query Parameters:**
- `q` (required) - Texto de busca (mínimo 3 caracteres)
- `courseId` (optional) - Filtrar por ID da matéria
- `courseSlug` (optional) - Filtrar por slug da matéria
- `type` (optional) - Filtrar por tipo: `objective` ou `discursive`
- `source` (optional) - Filtrar por origem: `quizzes` ou `exams`

**Exemplo:**
```
/api/search?q=DevOps&type=objective&courseId=1
```

**Response:**
```json
{
  "success": true,
  "query": "DevOps",
  "filters": {
    "type": "objective",
    "courseId": "1"
  },
  "count": 5,
  "data": [
    {
      "question": "Qual das alternativas...",
      "type": "objective",
      "options": [...],
      "answer": "Resposta correta",
      "image": null,
      "courseId": 1,
      "courseName": "Arquitetura de Sistemas",
      "courseSlug": "arquitetura-de-sistemas",
      "questionIndex": 0
    }
  ]
}
```

---

## 📊 Estrutura dos Dados

### Course Object
```json
{
  "id": 1,
  "course": "Nome da Matéria",
  "slug": "nome-da_materia",
  "totalQuizQuestions": 50,
  "totalExamQuestions": 11,
  "data": {
    "quizzes": [...],
    "exams": [...]
  }
}
```

### Question Object
```json
{
  "question": "Texto da pergunta",
  "type": "objective",
  "options": [
    { "text": "Opção 1" },
    { "text": "Opção 2" }
  ],
  "answer": "Resposta correta",
  "image": "caminho/para/imagem.png"
}
```

**Tipos de Questões:**
- `objective` - Múltipla escolha (possui `options`)
- `discursive` - Dissertativa (sem `options`, array vazio)

---

## 🔧 Error Responses

Todos os erros seguem o formato:

```json
{
  "success": false,
  "error": "Mensagem de erro"
}
```

**Códigos HTTP:**
- `400` - Bad Request (parâmetros inválidos)
- `404` - Not Found (recurso não encontrado)
- `500` - Internal Server Error

---

## 🎯 Exemplos de Uso

### Gerar Simulado de 20 Questões Objetivas
```javascript
fetch('http://localhost:3000/api/quiz/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseSlug: 'arquitetura-de-sistemas',
    limit: 20,
    type: 'objective',
    source: 'both',
    shuffle: true
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

### Validar Respostas
```javascript
fetch('http://localhost:3000/api/quiz/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    answers: [
      {
        courseId: 1,
        questionIndex: 0,
        userAnswer: "Uma abordagem que integra desenvolvimento e operações para melhorar a entrega de software.",
        source: "quizzes"
      }
    ]
  })
})
.then(res => res.json())
.then(data => console.log(data));
```

---

## 📝 Notes

- A API **sempre retorna as respostas corretas** em todos os endpoints que retornam questões
- Isso permite que o frontend valide as respostas localmente ou envie para validação no endpoint `/api/quiz/validate`
- Todos os endpoints retornam JSON
- CORS está habilitado para todas as origens
- As respostas estão no campo `answer` de cada questão
