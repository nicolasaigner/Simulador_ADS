const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

// GET /api/courses - List all courses
router.get('/', (req, res) => {
  try {
    const courses = dataService.getAllCourses();
    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/courses/stats - Get statistics
router.get('/stats', (req, res) => {
  try {
    const stats = dataService.getStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/courses/:identifier - Get specific course (by ID, slug, or name)
router.get('/:identifier', (req, res) => {
  try {
    const course = dataService.getCourse(req.params.identifier);

    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    // Opção de incluir ou não as questões
    const includeQuestions = req.query.includeQuestions === 'true';

    const response = {
      id: course.id,
      name: course.course,
      slug: course.slug,
      totalQuizQuestions: course.totalQuizQuestions,
      totalExamQuestions: course.totalExamQuestions,
      totalQuestions: course.totalQuizQuestions + course.totalExamQuestions
    };

    if (includeQuestions) {
      response.quizzes = course.data.quizzes;
      response.exams = course.data.exams;
    }

    res.json({
      success: true,
      data: response
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/courses/:identifier/quizzes - Get course quizzes
router.get('/:identifier/quizzes', (req, res) => {
  try {
    const { type, hasImage } = req.query;

    const filters = {};
    if (type) filters.type = type;
    if (hasImage !== undefined) filters.hasImage = hasImage === 'true';

    const quizzes = dataService.getCourseQuizzes(req.params.identifier, filters);

    if (!quizzes) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.json({
      success: true,
      count: quizzes.length,
      filters,
      data: quizzes
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET /api/courses/:identifier/exams - Get course exams
router.get('/:identifier/exams', (req, res) => {
  try {
    const { type, hasImage } = req.query;

    const filters = {};
    if (type) filters.type = type;
    if (hasImage !== undefined) filters.hasImage = hasImage === 'true';

    const exams = dataService.getCourseExams(req.params.identifier, filters);

    if (!exams) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }

    res.json({
      success: true,
      count: exams.length,
      filters,
      data: exams
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
