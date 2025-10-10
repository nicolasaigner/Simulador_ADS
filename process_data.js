const fs = require('fs');
const path = require('path');

// Função para ler JSON
function readJSON(filePath) {
    try {
        const content = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error(`Erro ao ler ${filePath}:`, error.message);
        return null;
    }
}

// Função para processar questões objetivas
function processObjectiveQuestions(questions) {
    return questions.map(q => ({
        question: q.question || "",
        type: "objective",
        options: q.options || [],
        answer: q.Resposta || q.answer || "",
        image: q.image || null
    }));
}

// Função para processar questões discursivas
function processDiscursiveQuestions(questions) {
    return questions.map(q => ({
        question: q.question || "",
        type: "discursive",
        options: [],
        answer: q.Resposta || q.answer || "",
        image: q.image || null
    }));
}

// Mapeamento de pastas para nomes de matérias
const courseMappings = {
    "Arquitetura de Sistemas - Atividades e Provas": "Arquitetura de Sistemas",
    "Aspectos Legais da Tecnologia da Informação - Provas": "Aspectos Legais da Tecnologia da Informação",
    "Empreendorismo - Atividades": "Empreendorismo",
    "Fundamentos de Redes de Computadores - Atividades": "Fundamentos de Redes de Computadores",
    "Gestão de Projetos de Software - Atividades": "Gestão de Projetos de Software",
    "Gestão de Qualidade de Software - Atividades": "Gestão de Qualidade de Software",
    "Governança de Tecnologia da Informação - Atividades": "Governança de Tecnologia da Informação",
    "Segurança da Informação - Atividades": "Segurança da Informação"
};

// Diretório base
const materiasDir = path.join(__dirname, 'Materias');
const allData = { courses: [] };

// Processar cada matéria
Object.keys(courseMappings).forEach(folderName => {
    const courseName = courseMappings[folderName];
    const courseDir = path.join(materiasDir, folderName);

    console.log(`\nProcessando: ${courseName}`);

    const courseData = {
        course: courseName,
        data: {
            quizzes: [],
            exams: []
        }
    };

    // Ler todos os arquivos da pasta
    const files = fs.readdirSync(courseDir);

    files.forEach(file => {
        const filePath = path.join(courseDir, file);

        // Processar perguntas de atividades (quizzes)
        if (file.startsWith('perguntas_atividade') ||
            (file === 'perguntas.json' && !folderName.includes('Prova'))) {
            console.log(`  - Lendo questões objetivas de atividade: ${file}`);
            const questions = readJSON(filePath);
            if (questions) {
                courseData.data.quizzes.push(...processObjectiveQuestions(questions));
            }
        }

        // Processar temas de atividades (quizzes discursivas)
        if (file.startsWith('temas_atividade') ||
            (file === 'temas.json' && !folderName.includes('Prova'))) {
            console.log(`  - Lendo questões discursivas de atividade: ${file}`);
            const questions = readJSON(filePath);
            if (questions) {
                courseData.data.quizzes.push(...processDiscursiveQuestions(questions));
            }
        }

        // Processar perguntas de provas (exams)
        if (file.startsWith('perguntas_prova')) {
            console.log(`  - Lendo questões objetivas de prova: ${file}`);
            const questions = readJSON(filePath);
            if (questions) {
                courseData.data.exams.push(...processObjectiveQuestions(questions));
            }
        }

        // Processar temas de provas (exams discursivas)
        if (file.startsWith('temas_prova')) {
            console.log(`  - Lendo questões discursivas de prova: ${file}`);
            const questions = readJSON(filePath);
            if (questions) {
                courseData.data.exams.push(...processDiscursiveQuestions(questions));
            }
        }
    });

    console.log(`  ✓ Total de questões de atividades: ${courseData.data.quizzes.length}`);
    console.log(`  ✓ Total de questões de provas: ${courseData.data.exams.length}`);

    allData.courses.push(courseData);
});

// Salvar o arquivo consolidado
const outputPath = path.join(__dirname, 'database', 'all_data.json');
fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2), 'utf8');

console.log(`\n✓ Arquivo consolidado salvo em: ${outputPath}`);
console.log(`✓ Total de matérias processadas: ${allData.courses.length}`);

