# 🎓 Simulador ADS - API

API RESTful profissional para simulador de provas e atividades do curso de Análise e Desenvolvimento de Sistemas.

## 📋 Sobre o Projeto

Esta API centraliza todas as questões de atividades e provas das matérias do curso ADS, permitindo:
- Gerar simulados personalizados
- Validar respostas
- Buscar questões por texto
- Obter estatísticas sobre questões

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **CORS** - Habilitado para todas as origens
- **JSON** - Banco de dados baseado em arquivo

## 📊 Estatísticas

- **8 Matérias** disponíveis
- **296 Questões** no total
- **220 Questões de atividades**
- **76 Questões de provas**
- **270 Questões objetivas**
- **26 Questões discursivas**

## 🏗️ Estrutura do Projeto

```
Simulador_ADS/
├── database/
│   └── all_data.json          # Banco de dados consolidado
├── src/
│   ├── server.js              # Servidor Express
│   ├── routes/                # Rotas da API
│   │   ├── courses.js         # Endpoints de matérias
│   │   ├── quiz.js            # Endpoints de simulados
│   │   └── search.js          # Endpoint de busca
│   └── services/
│       └── dataService.js     # Serviço de dados
├── scripts/
│   └── consolidate_data.js    # Script para consolidar dados
├── public/                    # Arquivos estáticos (opcional)
├── API_DOCUMENTATION.md       # Documentação completa da API
└── package.json
```

## 🔧 Instalação

1. Clone o repositório
```bash
git clone <seu-repositorio>
cd Simulador_ADS
```

2. Instale as dependências
```bash
npm install
```

3. Inicie o servidor
```bash
npm start
```

Ou use o arquivo batch:
```bash
start-server.bat
```

A API estará disponível em `http://localhost:3000`

## 📚 Matérias Disponíveis

1. Arquitetura de Sistemas
2. Aspectos Legais da Tecnologia da Informação
3. Empreendorismo
4. Fundamentos de Redes de Computadores
5. Gestão de Projetos de Software
6. Gestão de Qualidade de Software
7. Governança de Tecnologia da Informação
8. Segurança da Informação

## 🎯 Endpoints Principais

### Listar Matérias
```http
GET /api/courses
```

### Gerar Simulado
```http
POST /api/quiz/generate
Content-Type: application/json

{
  "courseSlug": "arquitetura-de-sistemas",
  "limit": 10,
  "type": "objective",
  "source": "quizzes"
}
```

### Buscar Questões
```http
GET /api/search?q=DevOps&type=objective
```

### Validar Respostas
```http
POST /api/quiz/validate
Content-Type: application/json

{
  "answers": [
    {
      "courseId": 1,
      "questionIndex": 0,
      "userAnswer": "Sua resposta",
      "source": "quizzes"
    }
  ]
}
```

## 📖 Documentação Completa

Para documentação detalhada de todos os endpoints, consulte:
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🔄 Scripts Úteis

### Consolidar dados das matérias
```bash
node scripts/consolidate_data.js
```

Este script:
- Lê todos os arquivos JSON das matérias
- Normaliza o formato
- Consolida tudo em `database/all_data.json`

## 🌐 Exemplo de Uso com Frontend

```javascript
// Buscar todas as matérias
const courses = await fetch('http://localhost:3000/api/courses')
  .then(res => res.json());

// Gerar simulado de 15 questões
const quiz = await fetch('http://localhost:3000/api/quiz/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    courseSlug: 'arquitetura-de-sistemas',
    limit: 15,
    type: 'objective',
    shuffle: true
  })
}).then(res => res.json());

// Validar respostas
const result = await fetch('http://localhost:3000/api/quiz/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    answers: [
      {
        courseId: quiz.quiz.courseId,
        questionIndex: 0,
        userAnswer: "Resposta do usuário",
        source: "quizzes"
      }
    ]
  })
}).then(res => res.json());

console.log(`Acertos: ${result.data.percentage}%`);
```

## 📝 Formato das Questões

### Questão Objetiva (Múltipla Escolha)
```json
{
  "question": "Qual das alternativas...",
  "type": "objective",
  "options": [
    { "text": "Opção A" },
    { "text": "Opção B" },
    { "text": "Opção C" }
  ],
  "answer": "Opção correta",
  "image": null
}
```

### Questão Discursiva
```json
{
  "question": "Explique o conceito de...",
  "type": "discursive",
  "options": [],
  "answer": "Resposta esperada...",
  "image": null
}
```

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` (opcional):
```env
PORT=3000
```

## 🛠️ Desenvolvimento

### Adicionar Novas Questões

1. Adicione os arquivos JSON na pasta `Materias/Nome_da_Materia/`
   - `perguntas.json` ou `perguntas_atividade_X.json` - Questões objetivas de atividades
   - `temas.json` ou `temas_atividade_X.json` - Questões discursivas de atividades
   - `perguntas_prova_X.json` - Questões objetivas de provas
   - `temas_prova_X.json` - Questões discursivas de provas

2. Execute o script de consolidação:
```bash
node scripts/consolidate_data.js
```

3. Reinicie o servidor

## 🔐 CORS

CORS está habilitado para todas as origens. Em produção, configure adequadamente:

```javascript
app.use(cors({
  origin: 'https://seu-frontend.com'
}));
```

## 📄 Licença

Este projeto é de uso educacional para o curso de ADS.

## 👨‍💻 Autor

Desenvolvido para auxiliar nos estudos do curso de Análise e Desenvolvimento de Sistemas.

---

**Versão:** 1.0.0  
**Última atualização:** 2025-10-09

