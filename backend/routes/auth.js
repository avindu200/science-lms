// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // db.js එක සම්බන්ධ කිරීම

// 1. STUDENT REGISTRATION (ශිෂ්‍යයන් ලියාපදිංචි වීම)
router.post('/register', async (req, res) => {
    const { username, password, fullName, grade } = req.body;

    try {
        // Username එක දැනටමත් තියෙනවද බැලීම
        const userExist = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ message: "Username already exists!" });
        }

        // Password එක ආරක්ෂිතව Hash (encrypt) කිරීම
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Database එකට ඇතුල් කිරීම (Default status: 'pending', role: 'student')
        await db.query(
            'INSERT INTO users (username, password_hash, full_name, grade, role, status) VALUES ($1, $2, $3, $4, $5, $6)',
            [username, hashedPassword, fullName, grade, 'student', 'pending']
        );

        res.status(201).json({ message: "Registration successful! Waiting for teacher approval." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. STUDENT LOGIN (ශිෂ්‍ය ලොගින් එක)
router.post('/login/student', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Invalid Username or Password" });
        }

        const user = result.rows[0];

        // Student කෙනෙක්ද කියා බැලීම (Admin ලාට මෙතනින් ලොග් වෙන්න බෑ)
        if (user.role !== 'student') {
            return res.status(403).json({ message: "Access denied. Please use the Teacher Portal." });
        }

        // ටීචර් approve කරලා නැත්නම් බ්ලොක් කිරීම
        if (user.status === 'pending') {
            return res.status(403).json({ message: "Your account is pending teacher approval." });
        }
        if (user.status === 'rejected') {
            return res.status(403).json({ message: "Your account request has been rejected." });
        }

        // Password එක ගැලපේදැයි බැලීම
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Username or Password" });
        }

        // Security Token එකක් (JWT) සෑදීම
        const token = jwt.sign(
            { id: user.id, role: user.role, grade: user.grade },
            process.env.JWT_SECRET,
            { expiresIn: '7d' } // දින 7ක් වලංගුයි
        );

        res.json({
            token,
            user: { id: user.id, name: user.full_name, grade: user.grade, role: user.role }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. ADMIN/TEACHER LOGIN (ගුරු ලොගින් එක)
router.post('/login/admin', async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(400).json({ message: "Invalid Admin Credentials" });
        }

        const user = result.rows[0];

        // Admin කෙනෙක්ද කියා බැලීම
        if (user.role !== 'admin') {
            return res.status(403).json({ message: "Access denied. You are not authorized." });
        }

        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials" });
        }

        // Token
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1d' } // දින 1ක් වලංගුයි
        );

        res.json({
            token,
            user: { id: user.id, name: user.full_name, role: user.role }
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// backend/routes/auth.js පතුලටම (module.exports එකට උඩින්) මේක දාන්න:

// 🛠️ AUTOMATIC ADMIN CREATOR (100% Foolproof)
router.get('/setup-admin', async (req, res) => {
    try {
        // 1. කලින් හදපු admin කෙනෙක් ඉන්නවා නම් ඔහුව අයින් කරනවා
        await db.query("DELETE FROM users WHERE username = 'admin_teacher'");

        // 2. Password එක ඔයාගේ Mac එකෙන්ම hash කරගන්නවා
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('adminpassword123', salt);

        // 3. Database එකට insert කරනවා
        await db.query(
            "INSERT INTO users (username, password_hash, full_name, grade, role, status) VALUES ($1, $2, $3, $4, $5, $6)",
            ['admin_teacher', hashedPassword, 'Science Teacher', 11, 'admin', 'approved']
        );

        res.send("<h1>Admin Created Successfully!</h1><p>Username: <b>admin_teacher</b><br>Password: <b>adminpassword123</b></p>");
    } catch (err) {
        res.status(500).send("Error: " + err.message);
    }
});

module.exports = router;