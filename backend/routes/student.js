// backend/routes/student.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const supabase = require('../superbaseClient'); // ඔයා හදපු file එකේ නම (superbaseClient) මෙතනට දැම්මා
const multer = require('multer');
const { verifyToken } = require('../middleware/auth');

const upload = multer({ storage: multer.memoryStorage() });

// ==========================================
// 1. GET STUDENT PROFILE (ශිෂ්‍යයාගේ තොරතුරු)
// ==========================================
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const result = await db.query(
            "SELECT id, username, full_name, grade, status FROM users WHERE id = $1",
            [req.user.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 2. GET PAPERS BY GRADE (ළමයාගේ පන්තියට අදාළ පේපර්ස් පමණක් ගැනීම)
// ==========================================
router.get('/papers', verifyToken, async (req, res) => {
    try {
        // req.user.grade එකෙන් ලොග් වෙලා ඉන්න ළමයාගේ පන්තිය ඔටෝමැටිකලි ගන්නවා
        const result = await db.query(
            "SELECT * FROM papers WHERE grade = $1 ORDER BY uploaded_at DESC",
            [req.user.grade]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 3. GET HOMEWORKS & SUBMISSION STATUS (ළමයාගේ පන්තියේ Homeworks ගැනීම)
// ==========================================
router.get('/homeworks', verifyToken, async (req, res) => {
    try {
        // මේ query එකෙන් Homework එකයි, ළමයා ඒක දැනටමත් කරලා තියෙනවද (Submitted) කියන එකයි දෙකම එකපාර ගන්නවා
        const queryText = `
            SELECT h.*, hs.submitted_file_url, hs.marks, hs.feedback,
            CASE WHEN hs.id IS NOT NULL THEN true ELSE false END AS is_submitted
            FROM homework h
            LEFT JOIN homework_submissions hs ON h.id = hs.homework_id AND hs.student_id = $1
            WHERE h.grade = $2
            ORDER BY h.deadline ASC
        `;
        const result = await db.query(queryText, [req.user.id, req.user.grade]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 4. SUBMIT HOMEWORK (Homework සර්වර් එකට භාරදීම)
// ==========================================
router.post('/submit-homework/:homeworkId', verifyToken, upload.single('homeworkFile'), async (req, res) => {
    const homeworkId = req.params.homeworkId;
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: "Please upload your homework file (PDF/Image)!" });
    }

    try {
        const fileName = `homework_${req.user.id}_${Date.now()}_${file.originalname}`;
        
        // Supabase Storage එකට upload කිරීම
        const { data, error } = await supabase.storage
            .from('lms-files')
            .upload(`submissions/${fileName}`, file.buffer, {
                contentType: file.mimetype,
                duplex: 'half'
            });

        if (error) throw error;

        // Public Link එක ගැනීම
        const { data: publicUrlData } = supabase.storage
            .from('lms-files')
            .getPublicUrl(`submissions/${fileName}`);

        const fileUrl = publicUrlData.publicUrl;

        // Database එකට සේව් කිරීම (දැනටමත් සබ්මිට් කරලා නම් UPDATE කරනවා, නැත්නම් INSERT කරනවා)
        const queryText = `
            INSERT INTO homework_submissions (homework_id, student_id, submitted_file_url)
            VALUES ($1, $2, $3)
            ON CONFLICT (homework_id, student_id)
            DO UPDATE SET submitted_file_url = $3, submitted_at = CURRENT_TIMESTAMP
        `;
        await db.query(queryText, [homeworkId, req.user.id, fileUrl]);

        res.status(201).json({ message: "Homework submitted successfully!", url: fileUrl });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 5. GET TEST MARKS FOR CHART (ලකුණු ටික ප්‍රගති ප්‍රස්ථාරයට ගැනීම)
// ==========================================
router.get('/my-marks', verifyToken, async (req, res) => {
    try {
        const result = await db.query(
            "SELECT test_name, marks, exam_date FROM test_marks WHERE student_id = $1 ORDER BY exam_date ASC",
            [req.user.id]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 6. GET LEADERBOARD (පන්තියේ හොඳම 5 දෙනාගේ ලකුණු පුවරුව)
// ==========================================
router.get('/leaderboard', verifyToken, async (req, res) => {
    try {
        // ළමයාගේ පන්තියේ (Grade) අවසන් විභාගයෙන් වැඩිම ලකුණු ගත්තු 5 දෙනා ගැනීම
        const queryText = `
            SELECT u.full_name, tm.test_name, tm.marks 
            FROM test_marks tm
            JOIN users u ON tm.student_id = u.id
            WHERE u.grade = $1
            ORDER BY tm.marks DESC
            LIMIT 5
        `;
        const result = await db.query(queryText, [req.user.grade]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 7. UPLOAD FEES SLIP (පන්ති ගාස්තු රිසිට්පත දැමීම)
// ==========================================
router.post('/upload-slip', verifyToken, upload.single('slipFile'), async (req, res) => {
    const { month } = req.body; // e.g., "October 2024"
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: "Please upload your payment slip!" });
    }

    try {
        const fileName = `slip_${req.user.id}_${Date.now()}_${file.originalname}`;

        const { data, error } = await supabase.storage
            .from('lms-files')
            .upload(`slips/${fileName}`, file.buffer, {
                contentType: file.mimetype,
                duplex: 'half'
            });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
            .from('lms-files')
            .getPublicUrl(`slips/${fileName}`);

        const fileUrl = publicUrlData.publicUrl;

        // Database එකට ඇතුල් කිරීම
        const queryText = `
            INSERT INTO payments (student_id, month, slip_url, status)
            VALUES ($1, $2, $3, 'pending')
            ON CONFLICT (student_id, month)
            DO UPDATE SET slip_url = $3, status = 'pending', uploaded_at = CURRENT_TIMESTAMP
        `;
        await db.query(queryText, [req.user.id, month, fileUrl]);

        res.status(201).json({ message: "Slip uploaded successfully! Waiting for approval." });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 8. GET ANNOUNCEMENTS (නිවේදන පුවරුව)
// ==========================================
router.get('/announcements', verifyToken, async (req, res) => {
    try {
        // පොදු නිවේදන (NULL) සහ ළමයාගේ පන්තියට අදාළ නිවේදන පමණක් ලබා ගැනීම
        const result = await db.query(
            "SELECT * FROM announcements WHERE target_grade IS NULL OR target_grade = $1 ORDER BY created_at DESC",
            [req.user.grade]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;