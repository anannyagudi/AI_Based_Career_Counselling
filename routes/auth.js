const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register User
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    user = new User({ name, email, password, role: role || 'student' });
    await user.save();

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });

    res.status(201).json({ token, userId: user.id, name: user.name, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role
      }
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET || 'secret', { expiresIn: '24h' });

    res.json({ token, userId: user.id, name: user.name, role: user.role });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
