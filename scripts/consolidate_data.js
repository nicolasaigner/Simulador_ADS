const fs = require('fs');
const path = require('path');

const materiasDir = path.join(__dirname, '..', 'Materias');
const outputFile = path.join(__dirname, '..', 'database', 'all_data.json');

// Mapeamento de nomes de pastas para nomes de cursos
const courseNameMap = {
  'Arquitetura de Sistemas - Atividades e Provas': 'Arquitetura de Sistemas',
  'Aspectos Legais da Tecnologia da Informação - Provas': 'Aspectos Legais da Tecnologia da Informação',
  'Empreendorismo - Atividades': 'Empreendorismo',
  'Fundamentos de Redes de Computadores - Atividades': 'Fundamentos de Redes de Computadores',
  'Gestão de Projetos de Software - Atividades': 'Gestão de Projetos de Software',
  'Gestão de Qualidade de Software - Atividades': 'Gestão de Qualidade de Software',
  'Governança de Tecnologia da Informação - Atividades': 'Governança de Tecnologia da Informação',
  'Segurança da Informação - Atividades': 'Segurança da Informação'
};

function processObjectiveQuestions(questions) {
  return questions.map(q => ({
    question: q.question,
    type: 'objective',
    options: q.options || [],
    answer: q.Resposta || q.answer || '',
    image: q.image || null
  }));
}

function processDiscursiveQuestions(questions) {
  return questions.map(q => ({
    question: q.question,
    type: 'discursive',
    options: [],
    answer: q.Resposta || q.answer || '',
    image: q.image || null
  }));
}

function processCourseFolder(folderPath, courseName) {
  const files = fs.readdirSync(folderPath);
  const courseData = {
    quizzes: [],
    exams: []
  };

  files.forEach(file => {
    const filePath = path.join(folderPath, file);

    if (!file.endsWith('.json')) return;

    try {
      const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Perguntas objetivas (atividades)
      if (file.startsWith('perguntas_atividade') || file === 'perguntas.json') {
        courseData.quizzes.push(...processObjectiveQuestions(content));
      }
      // Temas discursivos (atividades)
      else if (file.startsWith('temas_atividade') || file === 'temas.json') {
        courseData.quizzes.push(...processDiscursiveQuestions(content));
      }
      // Perguntas de prova
      else if (file.startsWith('perguntas_prova')) {
        courseData.exams.push(...processObjectiveQuestions(content));
      }
      // Temas de prova
      else if (file.startsWith('temas_prova')) {
        courseData.exams.push(...processDiscursiveQuestions(content));
      }
    } catch (error) {
      console.error(`Erro ao processar ${filePath}:`, error.message);
    }
  });

  return courseData;
}

function consolidateAllData() {
  const courses = [];

  const folders = fs.readdirSync(materiasDir);

  folders.forEach(folder => {
    const folderPath = path.join(materiasDir, folder);

    if (!fs.statSync(folderPath).isDirectory()) return;

    const courseName = courseNameMap[folder] || folder;
    console.log(`Processando: ${courseName}`);

    const courseData = processCourseFolder(folderPath, courseName);

    courses.push({
      id: courses.length + 1,
      course: courseName,
      slug: courseName.toLowerCase().replace(/\s+/g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
      totalQuizQuestions: courseData.quizzes.length,
      totalExamQuestions: courseData.exams.length,
      data: courseData
    });
  });

  const output = {
    version: '1.0.0',
    lastUpdated: new Date().toISOString(),
    totalCourses: courses.length,
    courses
  };

  fs.writeFileSync(outputFile, JSON.stringify(output, null, 2), 'utf8');
  console.log(`\n✅ Dados consolidados com sucesso em: ${outputFile}`);
  console.log(`📊 Total de cursos: ${courses.length}`);

  courses.forEach(course => {
    console.log(`\n📚 ${course.course}:`);
    console.log(`   - Questões de atividades: ${course.totalQuizQuestions}`);
    console.log(`   - Questões de provas: ${course.totalExamQuestions}`);
  });
}

consolidateAllData();
