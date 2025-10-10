---
sidebar_position: 2
---

# Guia Rápido

Configure e use a API em menos de 5 minutos! ⚡

## 📦 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/simulador-ads.git
cd simulador-ads
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Inicie o servidor
```bash
npm start
```

Ou use o arquivo batch (Windows):
```bash
start-server.bat
```

A API estará disponível em: **http://localhost:3000**

## ✅ Verificar se está funcionando

### Health Check
```bash
curl http://localhost:3000/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Simulador ADS API is running",
  "timestamp": "2025-10-09T..."
}
```

## 🎯 Primeira Requisição

### Listar todas as matérias

**cURL:**
```bash
curl http://localhost:3000/api/courses
```

**JavaScript:**
```javascript
fetch('http://localhost:3000/api/courses')
  .then(res => res.json())
  .then(data => console.log(data));
```

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

## 🎲 Gerar seu primeiro simulado

**JavaScript:**
```javascript
fetch('http://localhost:3000/api/quiz/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseSlug: 'arquitetura-de-sistemas',
    limit: 10,
    type: 'objective',
    shuffle: true
  })
})
.then(res => res.json())
.then(data => {
  console.log(`Simulado gerado: ${data.quiz.courseName}`);
  console.log(`Total de questões: ${data.quiz.totalQuestions}`);
  
  data.quiz.questions.forEach((q, i) => {
    console.log(`\n${i + 1}. ${q.question}`);
    q.options.forEach(opt => console.log(`   - ${opt.text}`));
    console.log(`   Resposta: ${q.answer}`);
  });
});
```

## 📊 Ver estatísticas

```javascript
fetch('http://localhost:3000/api/courses/stats')
  .then(res => res.json())
  .then(data => {
    console.log(`Total de questões: ${data.data.totalQuestions}`);
    console.log(`Objetivas: ${data.data.objectiveQuestions}`);
    console.log(`Discursivas: ${data.data.discursiveQuestions}`);
    console.log(`Com imagens: ${data.data.questionsWithImages}`);
  });
```

## 🔍 Buscar questões

```javascript
fetch('http://localhost:3000/api/search?q=DevOps')
  .then(res => res.json())
  .then(data => {
    console.log(`Encontradas ${data.count} questões sobre DevOps`);
    data.data.forEach(q => {
      console.log(`- ${q.question.substring(0, 60)}...`);
      console.log(`  Matéria: ${q.courseName}`);
    });
  });
```

## ✔️ Validar respostas

```javascript
fetch('http://localhost:3000/api/quiz/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    answers: [
      {
        courseId: 1,
        questionIndex: 0,
        userAnswer: "Sua resposta aqui",
        source: "quizzes"
      }
    ]
  })
})
.then(res => res.json())
.then(data => {
  console.log(`Acertos: ${data.data.correct}/${data.data.total}`);
  console.log(`Percentual: ${data.data.percentage}%`);
});
```

## 🎓 Próximos Passos

Agora que você já sabe o básico, explore:

- [Endpoints - Courses](./endpoints/courses.md) - Todos os endpoints de matérias
- [Endpoints - Quiz](./endpoints/quiz.md) - Gerar e validar simulados
- [Endpoints - Search](./endpoints/search.md) - Buscar questões
- [Exemplos com Imagens](./exemplos/imagens.md) - Questões com imagens

## 🛠️ Scripts Úteis

### Consolidar dados
Se você adicionar novas questões nas pastas `Materias/`:
```bash
node scripts/consolidate_data.js
```

### Executar testes
```bash
node test-api.js
```

## 📝 Configuração (Opcional)

Crie um arquivo `.env` na raiz:
```env
PORT=3000
```

## ❓ Precisa de Ajuda?

- Veja os [Exemplos Completos](./exemplos/basico.md)
- Consulte a [Referência da API](./endpoints/courses.md)
- Verifique os [Códigos de Erro](./referencia/erros.md)
---
sidebar_position: 1
---

# Introdução

Bem-vindo à documentação oficial da **Simulador ADS API**! 🎓

## O que é o Simulador ADS?

O Simulador ADS é uma API RESTful profissional desenvolvida para auxiliar estudantes do curso de **Análise e Desenvolvimento de Sistemas** a estudarem e praticarem para provas e atividades.

## 📊 Estatísticas

- **8 Matérias** disponíveis
- **296 Questões** no total
- **253 Questões objetivas** (múltipla escolha)
- **43 Questões discursivas**
- **2 Questões com imagens**

## 🎯 Funcionalidades Principais

### ✅ Gerenciamento de Cursos
- Listar todas as matérias disponíveis
- Obter detalhes de cada matéria
- Visualizar estatísticas completas

### ✅ Geração de Simulados
- Criar simulados personalizados
- Filtrar por tipo (objetivas/discursivas)
- Filtrar questões com/sem imagens
- Embaralhar questões
- Limitar quantidade de questões

### ✅ Validação de Respostas
- Validar respostas automaticamente
- Obter pontuação e percentual de acerto
- Feedback detalhado por questão

### ✅ Busca Inteligente
- Buscar questões por texto
- Filtrar por matéria
- Filtrar por tipo de questão

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **JSON** - Base de dados consolidada
- **CORS** - Habilitado para todas as origens

## 📚 Matérias Disponíveis

1. **Arquitetura de Sistemas** - 61 questões
2. **Aspectos Legais da Tecnologia da Informação** - 65 questões
3. **Empreendorismo** - 26 questões
4. **Fundamentos de Redes de Computadores** - 37 questões
5. **Gestão de Projetos de Software** - 14 questões
6. **Gestão de Qualidade de Software** - 22 questões
7. **Governança de Tecnologia da Informação** - 30 questões
8. **Segurança da Informação** - 41 questões

## 🎓 Para quem é?

Esta API é perfeita para:
- **Estudantes** que querem praticar para provas
- **Desenvolvedores** que querem criar aplicações de quiz
- **Professores** que querem integrar questões em suas plataformas

## 🔗 Links Rápidos

- [Guia Rápido](./guia-rapido.md) - Comece em 5 minutos
- [Endpoints - Courses](./endpoints/courses.md) - Gerenciar matérias
- [Endpoints - Quiz](./endpoints/quiz.md) - Gerar simulados
- [Exemplos Básicos](./exemplos/basico.md) - Código pronto para usar

## 📝 Próximos Passos

1. Leia o [Guia Rápido](./guia-rapido.md) para configurar
2. Explore os [Endpoints](./endpoints/courses.md) disponíveis
3. Veja os [Exemplos de Código](./exemplos/basico.md)
4. Teste com suas próprias requisições!

---

**Versão da API:** 1.0.0  
**Última atualização:** 2025-10-09

