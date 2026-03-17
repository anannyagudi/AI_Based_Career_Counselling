const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const User = require('../models/User');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

// Get all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('coach', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get courses by topic
router.get('/topic/:topic', async (req, res) => {
  try {
    const courses = await Course.find({ topic: req.params.topic }).populate('coach', 'name email');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get courses created by the logged-in coach
router.get('/my-courses', authMiddleware, async (req, res) => {
  try {
    const courses = await Course.find({ coach: req.user.id });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a single course by ID
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id).populate('coach', 'name email');
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Enroll in a course (Student only)
router.post('/:id/enroll', [authMiddleware, authorize('student')], async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    if (user.enrolledCourses.includes(req.params.id)) {
      return res.status(400).json({ error: 'Already enrolled in this course' });
    }

    user.enrolledCourses.push(req.params.id);
    await user.save();

    res.json({ message: 'Successfully enrolled' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a course (Coach only)
router.post('/', [authMiddleware, authorize('coach')], async (req, res) => {
  try {
    const { title, description, topic, pricePlan, price } = req.body;
    const newCourse = new Course({
      title,
      description,
      topic,
      coach: req.user.id,
      pricePlan,
      price: pricePlan === 'paid' ? price : 0,
    });

    const course = await newCourse.save();
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});


module.exports = router;
