const express = require('express');
const router = express.Router();
const perfSvc = require('../services/performanceService');
const gradeSvc = require('../services/gradeService');
const overviewSvc = require('../services/overviewService');
// GET /api/stats/exercises
router.get('/exercises', async (req, res) => {
  try {
    const data = await perfSvc.getExercisePerformance();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats/grades
router.get('/grades', async (req, res) => {
  try {
    const data = await gradeSvc.getGradeDistribution();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/stats/overview
router.get('/overview', async (req, res) => {
  try {
    const data = await overviewSvc.getOverview();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;