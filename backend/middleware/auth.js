// backend/middleware/auth.js
const jwt = require('jsonwebtoken');

// 1. ඕනෑම ලොග් වුණු කෙනෙක්ව Verify කරන Middleware එක
const verifyToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Header එකෙන් Token එක ගැනීම

    if (!token) {
        return res.status(401).json({ message: "No token, authorization denied!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Token එක ඇතුලේ තියෙන user data (id, role, grade) req එකට එකතු කිරීම
        next();
    } catch (err) {
        res.status(401).json({ message: "Token is not valid!" });
    }
};

// 2. ටීචර් (Admin) ද කියා පමණක් Verify කරන Middleware එක
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: "Access denied! Only teachers can access this." });
        }
    });
};

module.exports = { verifyToken, verifyAdmin };