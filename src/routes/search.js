const express = require('express');
const router = express.Router();
const dataService = require('../services/dataService');

// GET /api/search - Search questions
router.get('/', (req, res) => {
  try {
    const { q, courseId, courseSlug, type, source } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required'
      });
    }

    if (q.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Query must be at least 3 characters long'
      });
    }

    const filters = {};
    if (courseId) filters.courseId = courseId;
    if (courseSlug) filters.courseSlug = courseSlug;
    if (type) filters.type = type;
    if (source) filters.source = source;

    const results = dataService.searchQuestions(q, filters);

    res.json({
      success: true,
      query: q,
      filters,
      count: results.length,
      data: results
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

