const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/auth');
const predictRoutes = require('./routes/predict');
const courseRoutes = require('./routes/courses');
const userRoutes = require('./routes/user');

app.use('/api/auth', authRoutes);
app.use('/api/predict', predictRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/user', userRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB Connected'))
.catch((err) => console.log('MongoDB connection error: ', err));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
