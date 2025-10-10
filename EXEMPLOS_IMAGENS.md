# 📸 Exemplos de Endpoints para Questões com Imagens

## 🎯 Casos de Uso para Questões com Imagens

A API possui **2 questões com imagens**:
- **Empreendorismo**: 1 questão (`Img_perguntas/Empren1.png`)
- **Gestão de Projetos de Software**: 1 questão (`Img_perguntas/GPS1.png`)

---

## 📋 Exemplos de Endpoints

### 1️⃣ Buscar TODAS as questões com imagens de uma matéria específica

#### Empreendorismo - Questões com Imagens
```http
GET /api/courses/empreendorismo/quizzes?hasImage=true
```

**JavaScript:**
```javascript
fetch('http://localhost:3000/api/courses/empreendorismo/quizzes?hasImage=true')
  .then(res => res.json())
  .then(data => {
    console.log(`Questões com imagens: ${data.count}`);
    data.data.forEach(q => {
      console.log(`Questão: ${q.question}`);
      console.log(`Imagem: ${q.image}`);
      console.log(`Resposta: ${q.answer}`);
    });
  });
```

**Response:**
```json
{
  "success": true,
  "count": 1,
  "filters": {
    "hasImage": true
  },
  "data": [
    {
      "question": "A inovação é o segredo do desenvolvimento...<img src='./Img_perguntas/Empren1.png'>...",
      "type": "discursive",
      "options": [],
      "answer": "As inovações são as responsáveis...",
      "image": "Img_perguntas/Empren1.png"
    }
  ]
}
```

---

#### Gestão de Projetos de Software - Questões com Imagens
```http
GET /api/courses/gestao-de-projetos-de-software/quizzes?hasImage=true
```

**Por ID:**
```http
GET /api/courses/5/quizzes?hasImage=true
```

---

### 2️⃣ Gerar Simulado APENAS com Questões que têm Imagens

#### POST - Simulado com Imagens
```http
POST /api/quiz/generate
Content-Type: application/json

{
  "courseSlug": "empreendorismo",
  "hasImage": true,
  "limit": 10,
  "shuffle": true
}
```

**JavaScript:**
```javascript
fetch('http://localhost:3000/api/quiz/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseSlug: 'empreendorismo',
    hasImage: true,  // ⭐ Filtro para apenas questões com imagens
    limit: 10,
    shuffle: true
  })
})
.then(res => res.json())
.then(data => {
  console.log(`Total de questões com imagens: ${data.quiz.totalQuestions}`);
  data.quiz.questions.forEach((q, i) => {
    console.log(`${i + 1}. ${q.question.substring(0, 50)}...`);
    console.log(`   Imagem: ${q.image}`);
    console.log(`   Resposta: ${q.answer}`);
  });
});
```

**Response:**
```json
{
  "success": true,
  "quiz": {
    "courseId": 3,
    "courseName": "Empreendorismo",
    "courseSlug": "empreendorismo",
    "source": "quizzes",
    "totalQuestions": 1,
    "filters": {
      "type": null,
      "hasImage": true,
      "shuffle": true
    },
    "questions": [
      {
        "index": 0,
        "question": "A inovação é o segredo...",
        "type": "discursive",
        "options": [],
        "image": "Img_perguntas/Empren1.png",
        "answer": "As inovações são as responsáveis..."
      }
    ]
  }
}
```

---

### 3️⃣ Buscar Questões com Imagens de MÚLTIPLAS Matérias

#### Usando o endpoint GET (legacy)
```http
GET /api/quiz/random?course=empreendorismo&hasImage=true&limit=5
```

#### Para cada matéria separadamente:

**Empreendorismo:**
```javascript
const empreen = await fetch('http://localhost:3000/api/courses/3/quizzes?hasImage=true')
  .then(r => r.json());
```

**Gestão de Projetos:**
```javascript
const gps = await fetch('http://localhost:3000/api/courses/5/quizzes?hasImage=true')
  .then(r => r.json());
```

**Combinar os resultados:**
```javascript
const todasComImagens = [...empreen.data, ...gps.data];
console.log(`Total de questões com imagens: ${todasComImagens.length}`);
```

---

### 4️⃣ Filtrar Questões Objetivas COM Imagens

```http
GET /api/courses/empreendorismo/quizzes?type=objective&hasImage=true
```

**JavaScript:**
```javascript
fetch('http://localhost:3000/api/courses/empreendorismo/quizzes?type=objective&hasImage=true')
  .then(res => res.json())
  .then(data => {
    console.log(`Questões objetivas com imagens: ${data.count}`);
  });
```

---

### 5️⃣ Filtrar Questões Discursivas COM Imagens

```http
GET /api/courses/empreendorismo/quizzes?type=discursive&hasImage=true
```

**JavaScript:**
```javascript
fetch('http://localhost:3000/api/courses/empreendorismo/quizzes?type=discursive&hasImage=true')
  .then(res => res.json())
  .then(data => {
    console.log(`Questões discursivas com imagens: ${data.count}`);
  });
```

---

### 6️⃣ Buscar Questões SEM Imagens (Oposto)

```http
GET /api/courses/empreendorismo/quizzes?hasImage=false
```

**JavaScript:**
```javascript
fetch('http://localhost:3000/api/courses/empreendorismo/quizzes?hasImage=false')
  .then(res => res.json())
  .then(data => {
    console.log(`Questões SEM imagens: ${data.count}`);
  });
```

---

### 7️⃣ Gerar Simulado Misto (Com e Sem Imagens de Múltiplas Matérias)

**Buscar todas as questões com imagens:**
```javascript
const stats = await fetch('http://localhost:3000/api/courses/stats').then(r => r.json());

// Ver quais matérias têm questões com imagens
stats.data.courseBreakdown.forEach(course => {
  if (course.questionsWithImages > 0) {
    console.log(`${course.name}: ${course.questionsWithImages} questão(ões) com imagem`);
  }
});
```

**Gerar simulado de cada matéria:**
```javascript
// Empreendorismo
const quiz1 = await fetch('http://localhost:3000/api/quiz/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseSlug: 'empreendorismo',
    hasImage: true,
    source: 'both'
  })
}).then(r => r.json());

// Gestão de Projetos
const quiz2 = await fetch('http://localhost:3000/api/quiz/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseSlug: 'gestao-de-projetos-de-software',
    hasImage: true,
    source: 'both'
  })
}).then(r => r.json());

// Combinar as questões
const todasQuestoesComImagem = [
  ...quiz1.quiz.questions,
  ...quiz2.quiz.questions
];

console.log(`Total de questões com imagens: ${todasQuestoesComImagem.length}`);
```

---

## 🎨 Exibindo as Imagens no Frontend

As imagens estão na pasta `public/images/`. Para exibir no frontend:

```html
<!-- Exemplo HTML -->
<div class="question">
  <p>{{ question.question }}</p>
  
  <!-- Se a questão tiver imagem -->
  <img 
    v-if="question.image" 
    :src="`/images/${question.image.split('/').pop()}`" 
    alt="Imagem da questão"
    class="question-image"
  />
  
  <!-- Opções de resposta -->
  <div v-for="option in question.options" class="option">
    {{ option.text }}
  </div>
</div>
```

**JavaScript (Vue/React):**
```javascript
// Vue
<template>
  <div v-if="question.image">
    <img :src="`/images/${getImageName(question.image)}`" />
  </div>
</template>

<script>
methods: {
  getImageName(imagePath) {
    // "Img_perguntas/Empren1.png" -> "Empren1.png"
    return imagePath.split('/').pop();
  }
}
</script>

// React
{question.image && (
  <img 
    src={`/images/${question.image.split('/').pop()}`} 
    alt="Questão"
  />
)}
```

---

## 📊 Resumo dos Filtros Disponíveis

| Parâmetro | Valores | Descrição |
|-----------|---------|-----------|
| `hasImage` | `true`, `false` | Filtrar questões com/sem imagem |
| `type` | `objective`, `discursive` | Tipo da questão |
| `source` | `quizzes`, `exams`, `both` | Origem das questões |
| `limit` | número | Quantidade de questões |
| `shuffle` | `true`, `false` | Embaralhar questões |

**Exemplo combinando todos os filtros:**
```javascript
POST /api/quiz/generate
{
  "courseSlug": "empreendorismo",
  "type": "discursive",
  "hasImage": true,
  "source": "quizzes",
  "limit": 5,
  "shuffle": false
}
```

---

## 🔍 Verificar Quais Matérias Têm Imagens

```javascript
fetch('http://localhost:3000/api/courses/stats')
  .then(res => res.json())
  .then(data => {
    const cursosComImagens = data.data.courseBreakdown
      .filter(course => course.questionsWithImages > 0);
    
    console.log('Matérias com questões que têm imagens:');
    cursosComImagens.forEach(course => {
      console.log(`- ${course.name}: ${course.questionsWithImages} questão(ões)`);
    });
  });
```

**Output:**
```
Matérias com questões que têm imagens:
- Empreendorismo: 1 questão(ões)
- Gestão de Projetos de Software: 1 questão(ões)
```

