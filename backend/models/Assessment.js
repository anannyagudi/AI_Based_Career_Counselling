const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    enum: ['After 10th', 'After 12th'],
    required: true,
  },
  responses: {
    type: [Number], // array of 10 numeric values (1, 2, 3, 4 mapping to a, b, c, d)
    required: true,
  },
  recommendedCareer: {
    type: String,
    required: true,
  },
  confidenceScore: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
