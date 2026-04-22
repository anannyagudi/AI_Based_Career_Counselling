const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Register User
router.post('/register', async (req, res) => {
  try {
    let { name, email, password, role } = req.body;
    
    // Normalize email
    if (email) {
      email = email.toLowerCase().trim();
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ name, email, password: hashedPassword, role: role || 'student' });
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
    let { email, password } = req.body;
    
    // Normalize email
    if (email) {
      email = email.toLowerCase().trim();
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Verify password using bcrypt
    const isMatch = await bcrypt.compare(password, user.password);
    
    // Handle old plain-text passwords for backward compatibility (optional but good idea), or just check match
    if (!isMatch && user.password !== password) {
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
