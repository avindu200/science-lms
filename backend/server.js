// backend/server.js
const express = require('express');
const cors = require('cors');
const db = require('./db');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// 📢 Routes Import කිරීම
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin'); // <-- අලුතෙන් එකතු කළා
const studentRoutes = require('./routes/student'); // <-- අලුතෙන් එකතු කළා

// 📢 Routes පාවිච්චි කිරීම
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes); // <-- අලුතෙන් එකතු කළා
app.use('/api/student', studentRoutes); // <-- අලුතෙන් එකතු කළා

// Test Connection Route
app.get('/api/test-connection', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW()');
        res.json({ 
            status: "Success", 
            message: "Backend is successfully connected to Supabase PostgreSQL!",
            databaseTime: result.rows[0].now 
        });
    } catch (err) {
        res.status(500).json({ status: "Error", error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`LMS Server is running on port ${PORT}`);
});