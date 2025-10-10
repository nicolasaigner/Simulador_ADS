const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const coursesRouter = require('./routes/courses');
const quizRouter = require('./routes/quiz');
const searchRouter = require('./routes/search');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Routes
app.use('/api/courses', coursesRouter);
app.use('/api/quiz', quizRouter);
app.use('/api/search', searchRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Simulador ADS API is running',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint with API documentation
app.get('/', (req, res) => {
  res.json({
    name: 'Simulador ADS API',
    version: '1.0.0',
    description: 'API RESTful para simulador de provas e atividades do curso ADS',
    documentation: 'https://github.com/seu-usuario/simulador-ads/blob/main/API_DOCUMENTATION.md',
    endpoints: {
      health: {
        path: '/health',
        method: 'GET',
        description: 'Verifica o status da API'
      },
      courses: {
        list: {
          path: '/api/courses',
          method: 'GET',
          description: 'Lista todas as matérias'
        },
        stats: {
          path: '/api/courses/stats',
          method: 'GET',
          description: 'Obtém estatísticas gerais'
        },
        getOne: {
          path: '/api/courses/:identifier',
          method: 'GET',
          description: 'Obtém uma matéria por ID, slug ou nome'
        },
        quizzes: {
          path: '/api/courses/:identifier/quizzes',
          method: 'GET',
          description: 'Obtém questões de atividades'
        },
        exams: {
          path: '/api/courses/:identifier/exams',
          method: 'GET',
          description: 'Obtém questões de provas'
        }
      },
      quiz: {
        generate: {
          path: '/api/quiz/generate',
          method: 'POST',
          description: 'Gera um simulado personalizado'
        },
        random: {
          path: '/api/quiz/random',
          method: 'GET',
          description: 'Gera um simulado aleatório (legacy)'
        },
        validate: {
          path: '/api/quiz/validate',
          method: 'POST',
          description: 'Valida respostas de um simulado'
        }
      },
      search: {
        path: '/api/search',
        method: 'GET',
        description: 'Busca questões por texto'
      }
    }
  });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Something went wrong!',
    message: err.message
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════════╗');
  console.log('║                                                    ║');
  console.log('║         🎓 Simulador ADS API v1.0.0               ║');
  console.log('║                                                    ║');
  console.log('╚════════════════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Server running on: http://localhost:${PORT}`);
  console.log(`📚 API Docs: http://localhost:${PORT}/`);
  console.log(`💊 Health Check: http://localhost:${PORT}/health`);
  console.log('');
  console.log('📊 Available Endpoints:');
  console.log(`   GET    /api/courses`);
  console.log(`   GET    /api/courses/stats`);
  console.log(`   GET    /api/courses/:identifier`);
  console.log(`   POST   /api/quiz/generate`);
  console.log(`   POST   /api/quiz/validate`);
  console.log(`   GET    /api/search?q=...`);
  console.log('');
});

module.exports = app;
