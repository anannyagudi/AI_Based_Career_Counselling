const express = require('express');
const router = express.Router();
const axios = require('axios');
const Assessment = require('../models/Assessment');

// This route receives the 10 answers from the React frontend, sends them to FastAPI, and saves the result
router.post('/', async (req, res) => {
  try {
    const { userId, category, responses } = req.body;

    if (!userId || !category || !responses || responses.length !== 10) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    // Call FastAPI ML Engine
    let mlResponse;
    try {
      mlResponse = await axios.post(process.env.ML_ENGINE_URL || 'http://localhost:8000/predict', {
        responses
      });
    } catch (err) {
      console.error("FastAPI error:", err.message);
      return res.status(500).json({ error: 'Failed to get prediction from ML engine' });
    }

    const { recommendedCareer, confidenceScore } = mlResponse.data;

    // Save assessment result to DB
    const assessment = new Assessment({
      user: userId,
      category,
      responses,
      recommendedCareer,
      confidenceScore,
    });

    await assessment.save();

    res.status(201).json({
      message: 'Assessment completed',
      recommendedCareer,
      confidenceScore,
      assessmentId: assessment._id
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
