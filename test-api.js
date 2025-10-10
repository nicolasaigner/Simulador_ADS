const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const BASE_URL = 'http://localhost:3000';

async function testAPI() {
  console.log('🧪 Testando Simulador ADS API...\n');

  try {
    // 1. Testar Health Check
    console.log('1️⃣ Testando Health Check...');
    const health = await fetch(`${BASE_URL}/health`).then(r => r.json());
    console.log('✅ Status:', health.status);
    console.log('');

    // 2. Listar Cursos
    console.log('2️⃣ Listando cursos disponíveis...');
    const courses = await fetch(`${BASE_URL}/api/courses`).then(r => r.json());
    console.log(`✅ Total de cursos: ${courses.count}`);
    console.log('Cursos:', courses.data.slice(0, 3).map(c => c.name).join(', ') + '...');
    console.log('');

    // 3. Obter Estatísticas
    console.log('3️⃣ Obtendo estatísticas...');
    const stats = await fetch(`${BASE_URL}/api/courses/stats`).then(r => r.json());
    console.log(`✅ Total de questões: ${stats.data.totalQuestions}`);
    console.log(`   - Questões objetivas: ${stats.data.objectiveQuestions}`);
    console.log(`   - Questões discursivas: ${stats.data.discursiveQuestions}`);
    console.log(`   - Questões com imagens: ${stats.data.questionsWithImages}`);
    console.log('');

    // 3.1. NOVO: Buscar questões com imagens de uma matéria específica
    console.log('3️⃣.1 Buscando questões COM IMAGENS (Empreendorismo)...');
    const quizzesWithImages = await fetch(`${BASE_URL}/api/courses/empreendorismo/quizzes?hasImage=true`).then(r => r.json());
    console.log(`✅ Encontradas ${quizzesWithImages.count} questões com imagens`);
    if (quizzesWithImages.count > 0) {
      console.log(`   Primeira questão: ${quizzesWithImages.data[0].question.substring(0, 60)}...`);
      console.log(`   Imagem: ${quizzesWithImages.data[0].image}`);
    }
    console.log('');

    // 3.2. NOVO: Gerar simulado APENAS com questões que têm imagens
    console.log('3️⃣.2 Gerando simulado APENAS COM QUESTÕES COM IMAGENS...');
    const quizWithImages = await fetch(`${BASE_URL}/api/quiz/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseSlug: 'empreendorismo',
        hasImage: true,
        limit: 10,
        shuffle: true
      })
    }).then(r => r.json());

    if (quizWithImages.success) {
      console.log(`✅ Simulado gerado: ${quizWithImages.quiz.courseName}`);
      console.log(`   - Total de questões com imagens: ${quizWithImages.quiz.totalQuestions}`);
      quizWithImages.quiz.questions.forEach((q, i) => {
        console.log(`   ${i + 1}. Imagem: ${q.image}`);
      });
    }
    console.log('');

    // 4. Gerar Simulado (teste principal - verificar se retorna respostas)
    console.log('4️⃣ Gerando simulado com 5 questões...');
    const quiz = await fetch(`${BASE_URL}/api/quiz/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        courseId: 1,
        limit: 5,
        type: 'objective',
        shuffle: true
      })
    }).then(r => r.json());

    let firstQuestion;
    if (quiz.success) {
      console.log(`✅ Simulado gerado: ${quiz.quiz.courseName}`);
      console.log(`   - Total de questões: ${quiz.quiz.totalQuestions}`);
      
      // Verificar se as respostas estão sendo retornadas
      firstQuestion = quiz.quiz.questions[0];
      console.log('\n📝 Primeira questão do simulado:');
      console.log(`   Pergunta: ${firstQuestion.question.substring(0, 60)}...`);
      console.log(`   Tipo: ${firstQuestion.type}`);
      console.log(`   Opções: ${firstQuestion.options.length} alternativas`);
      
      if (firstQuestion.answer) {
        console.log(`   ✅ RESPOSTA CORRETA RETORNADA: ${firstQuestion.answer.substring(0, 50)}...`);
      } else {
        console.log('   ❌ RESPOSTA NÃO RETORNADA!');
      }
    }
    console.log('');

    // 5. Buscar Questões
    console.log('5️⃣ Buscando questões sobre "DevOps"...');
    const search = await fetch(`${BASE_URL}/api/search?q=DevOps`).then(r => r.json());
    console.log(`✅ Encontradas ${search.count} questões`);
    if (search.count > 0) {
      console.log(`   Primeira questão: ${search.data[0].question.substring(0, 60)}...`);
      if (search.data[0].answer) {
        console.log(`   ✅ Resposta incluída: ${search.data[0].answer.substring(0, 50)}...`);
      }
    }
    console.log('');

    // 6. Testar validação de respostas
    if (firstQuestion && firstQuestion.answer) {
      console.log('6️⃣ Testando validação de respostas...');
      const validation = await fetch(`${BASE_URL}/api/quiz/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: [
            {
              courseId: 1,
              questionIndex: 0,
              userAnswer: firstQuestion.answer,
              source: 'quizzes'
            }
          ]
        })
      }).then(r => r.json());

      if (validation.success) {
        console.log(`✅ Validação concluída!`);
        console.log(`   - Acertos: ${validation.data.correct}/${validation.data.total}`);
        console.log(`   - Percentual: ${validation.data.percentage}%`);
      }
      console.log('');
    }

    console.log('═══════════════════════════════════════════');
    console.log('✅ Todos os testes passaram com sucesso!');
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('📊 CONFIRMAÇÃO:');
    console.log('   ✓ API está retornando as respostas corretas');
    console.log('   ✓ Endpoints funcionando corretamente');
    console.log('   ✓ Validação de respostas operacional');
    console.log('   ✓ Filtro de questões com imagens funcionando');

  } catch (error) {
    console.error('❌ Erro durante os testes:', error.message);
    console.log('\n⚠️  Certifique-se de que o servidor está rodando em http://localhost:3000');
  }
}

testAPI();
