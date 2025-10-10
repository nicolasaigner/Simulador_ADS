const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

// POST /api/quiz/generate - Generate a custom quiz
router.post('/generate', (req, res) => {
  try {
    const {
      courseId,
      courseSlug,
      courseName,
      source = 'quizzes', // 'quizzes', 'exams', 'both'
      limit = 10,
      type = null, // 'objective', 'discursive'
      hasImage = null,
      shuffle = true
    } = req.body;

    const identifier = courseId || courseSlug || courseName;

    if (!identifier) {
      return res.status(400).json({
        success: false,
        error: 'Course identifier is required (courseId, courseSlug, or courseName)'
      });
    }

    const options = { source, limit, type, hasImage, shuffle };
    const questions = dataService.getRandomQuestions(identifier, options);

    if (!questions) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    if (questions.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'No questions found matching the criteria'
      });
    }

    const course = dataService.getCourse(identifier);

    res.json({
      success: true,
      quiz: {
        courseId: course.id,
        courseName: course.course,
        courseSlug: course.slug,
        source,
        totalQuestions: questions.length,
        filters: { type, hasImage, shuffle },
        questions: questions.map((q, index) => ({
          index,
          question: q.question,
          type: q.type,
          options: q.options,
          image: q.image,
          answer: q.answer // Sempre retorna a resposta correta
        }))
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/quiz/random - Generate random quiz (backward compatibility)
router.get('/random', (req, res) => {
  try {
    const {
      course,
      source = 'quizzes',
      limit = 10,
      type,
      hasImage,
      shuffle = 'true'
    } = req.query;

    if (!course) {
      return res.status(400).json({
        success: false,
        error: 'Course parameter is required'
      });
    }

    const options = {
      source,
      limit: parseInt(limit),
      type: type || null,
      hasImage: hasImage ? hasImage === 'true' : null,
      shuffle: shuffle === 'true'
    };

    const questions = dataService.getRandomQuestions(course, options);

    if (!questions) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    const courseData = dataService.getCourse(course);

    res.json({
      success: true,
      courseId: courseData.id,
      courseName: courseData.course,
      courseSlug: courseData.slug,
      source,
      count: questions.length,
      data: questions.map((q, index) => ({
        index,
        question: q.question,
        type: q.type,
        options: q.options,
        image: q.image,
        answer: q.answer // Sempre retorna a resposta correta
      }))
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// POST /api/quiz/validate - Validate quiz answers
router.post('/validate', (req, res) => {
  try {
    const { answers } = req.body;

    if (!Array.isArray(answers)) {
      return res.status(400).json({
        success: false,
        error: 'Answers must be an array of objects with structure: { courseId, questionIndex, userAnswer, source }'
      });
    }

    if (answers.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Answers array cannot be empty'
      });
    }

    const validation = dataService.validateAnswers(answers);

    res.json({
      success: true,
      data: validation
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
