const fs = require('fs');
const path = require('path');

class DataService {
  constructor() {
    this.dataPath = path.join(__dirname, '../../database/all_data.json');
    this.data = null;
    this.loadData();
  }

  loadData() {
    try {
      const rawData = fs.readFileSync(this.dataPath, 'utf8');
      this.data = JSON.parse(rawData);
      console.log('✓ Data loaded successfully');
    } catch (error) {
      console.error('Error loading data:', error);
      this.data = { courses: [] };
    }
  }

  // Recarregar dados (útil para desenvolvimento)
  reloadData() {
    this.loadData();
  }

  getAllCourses() {
    return this.data.courses.map(course => ({
      id: course.id,
      name: course.course,
      slug: course.slug,
      totalQuizQuestions: course.totalQuizQuestions,
      totalExamQuestions: course.totalExamQuestions,
      totalQuestions: course.totalQuizQuestions + course.totalExamQuestions
    }));
  }

  getCourseById(id) {
    return this.data.courses.find(c => c.id === parseInt(id)) || null;
  }

  getCourseBySlug(slug) {
    return this.data.courses.find(c => c.slug === slug) || null;
  }

  getCourseByName(courseName) {
    const course = this.data.courses.find(
      c => c.course.toLowerCase() === courseName.toLowerCase()
    );
    return course || null;
  }

  getCourse(identifier) {
    // Tenta encontrar por ID, slug ou nome
    return this.getCourseById(identifier) ||
           this.getCourseBySlug(identifier) ||
           this.getCourseByName(identifier);
  }

  getCourseQuizzes(identifier, filters = {}) {
    const course = this.getCourse(identifier);
    if (!course) return null;

    let quizzes = course.data.quizzes;

    // Filtrar por tipo (objective/discursive)
    if (filters.type) {
      quizzes = quizzes.filter(q => q.type === filters.type);
    }

    // Filtrar perguntas com imagens
    if (filters.hasImage !== undefined) {
      quizzes = quizzes.filter(q => filters.hasImage ? q.image !== null : q.image === null);
    }

    return quizzes;
  }

  getCourseExams(identifier, filters = {}) {
    const course = this.getCourse(identifier);
    if (!course) return null;

    let exams = course.data.exams;

    // Filtrar por tipo (objective/discursive)
    if (filters.type) {
      exams = exams.filter(q => q.type === filters.type);
    }

    // Filtrar perguntas com imagens
    if (filters.hasImage !== undefined) {
      exams = exams.filter(q => filters.hasImage ? q.image !== null : q.image === null);
    }

    return exams;
  }

  getRandomQuestions(identifier, options = {}) {
    const {
      source = 'quizzes', // 'quizzes', 'exams', 'both'
      limit = 10,
      type = null, // 'objective', 'discursive'
      hasImage = null,
      shuffle = true
    } = options;

    const course = this.getCourse(identifier);
    if (!course) return null;

    let questions = [];

    if (source === 'both') {
      questions = [...course.data.quizzes, ...course.data.exams];
    } else if (source === 'exams') {
      questions = course.data.exams;
    } else {
      questions = course.data.quizzes;
    }

    // Aplicar filtros
    if (type) {
      questions = questions.filter(q => q.type === type);
    }

    if (hasImage !== null) {
      questions = questions.filter(q => hasImage ? q.image !== null : q.image === null);
    }

    // Embaralhar se necessário
    if (shuffle) {
      questions = [...questions].sort(() => Math.random() - 0.5);
    }

    // Limitar quantidade
    return questions.slice(0, limit);
  }

  searchQuestions(query, filters = {}) {
    const results = [];
    const lowerQuery = query.toLowerCase();

    this.data.courses.forEach(course => {
      // Filtrar por curso se especificado
      if (filters.courseId && course.id !== parseInt(filters.courseId)) return;
      if (filters.courseSlug && course.slug !== filters.courseSlug) return;

      const allQuestions = [...course.data.quizzes, ...course.data.exams];

      let matches = allQuestions.filter(q =>
        q.question.toLowerCase().includes(lowerQuery) ||
        q.answer.toLowerCase().includes(lowerQuery)
      );

      // Aplicar filtros adicionais
      if (filters.type) {
        matches = matches.filter(q => q.type === filters.type);
      }

      if (filters.source) {
        const isQuiz = course.data.quizzes.includes(matches[0]);
        matches = matches.filter(() =>
          filters.source === 'quizzes' ? isQuiz : !isQuiz
        );
      }

      matches = matches.map((q, index) => ({
        ...q,
        courseId: course.id,
        courseName: course.course,
        courseSlug: course.slug,
        questionIndex: index
      }));

      results.push(...matches);
    });

    return results;
  }

  getStats() {
    const stats = {
      version: this.data.version,
      lastUpdated: this.data.lastUpdated,
      totalCourses: this.data.totalCourses,
      totalQuestions: 0,
      totalQuizQuestions: 0,
      totalExamQuestions: 0,
      objectiveQuestions: 0,
      discursiveQuestions: 0,
      questionsWithImages: 0,
      courseBreakdown: []
    };

    this.data.courses.forEach(course => {
      const allQuestions = [...course.data.quizzes, ...course.data.exams];

      const courseStats = {
        id: course.id,
        name: course.course,
        slug: course.slug,
        totalQuestions: allQuestions.length,
        quizQuestions: course.data.quizzes.length,
        examQuestions: course.data.exams.length,
        objectiveQuestions: allQuestions.filter(q => q.type === 'objective').length,
        discursiveQuestions: allQuestions.filter(q => q.type === 'discursive').length,
        questionsWithImages: allQuestions.filter(q => q.image !== null).length
      };

      stats.totalQuestions += courseStats.totalQuestions;
      stats.totalQuizQuestions += courseStats.quizQuestions;
      stats.totalExamQuestions += courseStats.examQuestions;
      stats.objectiveQuestions += courseStats.objectiveQuestions;
      stats.discursiveQuestions += courseStats.discursiveQuestions;
      stats.questionsWithImages += courseStats.questionsWithImages;

      stats.courseBreakdown.push(courseStats);
    });

    return stats;
  }

  validateAnswers(answers) {
    const results = [];
    let correctCount = 0;

    answers.forEach(answer => {
      const { courseId, questionIndex, userAnswer, source = 'quizzes' } = answer;

      const course = this.getCourseById(courseId);
      if (!course) {
        results.push({
          error: 'Course not found',
          ...answer
        });
        return;
      }

      const questions = source === 'exams' ? course.data.exams : course.data.quizzes;
      const question = questions[questionIndex];

      if (!question) {
        results.push({
          error: 'Question not found',
          ...answer
        });
        return;
      }

      const isCorrect = question.answer.toLowerCase().trim() === userAnswer.toLowerCase().trim();

      if (isCorrect) correctCount++;

      results.push({
        courseId,
        questionIndex,
        question: question.question,
        userAnswer,
        correctAnswer: question.answer,
        isCorrect,
        type: question.type
      });
    });

    return {
      total: answers.length,
      correct: correctCount,
      incorrect: answers.length - correctCount,
      percentage: answers.length > 0 ? ((correctCount / answers.length) * 100).toFixed(2) : 0,
      results
    };
  }
}

module.exports = new DataService();
