// backend/routes/admin.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const supabase = require('../superbaseClient'); // 'r' අකුර එකතු කරා
const multer = require('multer');
const { verifyAdmin } = require('../middleware/auth');

// Multer Setup (Computer එකේ තාවකාලිකව file එක memory එකේ තියාගන්න)
const upload = multer({ storage: multer.memoryStorage() });

// ==========================================
// 1. STUDENT APPROVALS (ළමයින් Approve කිරීම)
// ==========================================

// Pending ඉන්න ළමයින්ගේ ලිස්ට් එක බැලීම
router.get('/pending-students', verifyAdmin, async (req, res) => {
    try {
        const result = await db.query(
            "SELECT id, username, full_name, grade FROM users WHERE status = 'pending' AND role = 'student'"
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ළමයෙක්ව Approve හෝ Reject කිරීම
router.put('/decide-student/:id', verifyAdmin, async (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'
    const studentId = req.params.id;

    try {
        await db.query("UPDATE users SET status = $1 WHERE id = $2", [status, studentId]);
        res.json({ message: `Student status updated to ${status}!` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 2. PAPERS UPLOAD (පේපර්ස් Storage එකට දැමීම)
// ==========================================

// backend/routes/admin.js හි /upload-paper route එක මේ විදිහට UPDATE කරන්න:
router.post('/upload-paper', verifyAdmin, upload.single('paperFile'), async (req, res) => {
    const { title, grade, category, term } = req.body; // category සහ term ලබා ගැනීම
    const file = req.file;

    if (!file) {
        return res.status(400).json({ message: "Please upload a PDF file!" });
    }

    try {
        const fileName = `${Date.now()}_${file.originalname}`;
        
        const { data, error } = await supabase.storage
            .from('lms-files')
            .upload(`papers/${fileName}`, file.buffer, {
                contentType: file.mimetype,
                duplex: 'half'
            });

        if (error) throw error;

        const { data: publicUrlData } = supabase.storage
            .from('lms-files')
            .getPublicUrl(`papers/${fileName}`);

        const fileUrl = publicUrlData.publicUrl;

        // Database එකට අලුත් columns සමඟ සේව් කිරීම (Past Paper එකක් නම් term එක NULL වේ)
        const paperTerm = category === 'past_paper' ? null : parseInt(term);

        await db.query(
            'INSERT INTO papers (title, grade, category, term, file_url) VALUES ($1, $2, $3, $4, $5)',
            [title, grade, category, paperTerm, fileUrl]
        );

        res.status(201).json({ message: "Paper uploaded and saved successfully!", url: fileUrl });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 3. HOMEWORK MANAGEMENT (Homework දැමීම)
// ==========================================

router.post('/add-homework', verifyAdmin, async (req, res) => {
    const { title, description, grade, deadline } = req.body;

    try {
        await db.query(
            'INSERT INTO homework (title, description, grade, deadline) VALUES ($1, $2, $3, $4)',
            [title, description, grade, deadline]
        );
        res.status(201).json({ message: "Homework added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 4. TEST MARKS ENTRY (ලකුණු ඇතුලත් කිරීම)
// ==========================================

// backend/routes/admin.js හි /add-marks route එක මේ විදිහට UPDATE කරන්න:
router.post('/add-marks', verifyAdmin, async (req, res) => {
    const { studentId, testName, marks } = req.body;

    try {
        // 1. ලකුණු ටික ඇතුලත් කිරීම
        await db.query(
            'INSERT INTO test_marks (student_id, test_name, marks) VALUES ($1, $2, $3)',
            [studentId, testName, marks]
        );

        // 🌟 2. AUTOMATIC BADGE LOGIC (ළමයා ලකුණු 95+ ගත්තොත් පදක්කමක් දීම)
        if (marks >= 95) {
            await db.query(`
                INSERT INTO student_badges (student_id, badge_name, badge_desc, badge_icon)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (student_id, badge_name) DO NOTHING
            `, [
                studentId, 
                'Science Einstein ⚡', 
                `Scored an amazing ${marks}% on ${testName}!`, 
                'Zap'
            ]);
        }

        res.status(201).json({ message: "Marks added successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ==========================================
// 5. NOTICE BOARD (නිවේදන දැමීම)
// ==========================================

router.post('/add-announcement', verifyAdmin, async (req, res) => {
    const { title, content, targetGrade } = req.body; // targetGrade can be null (for all) or 6-11

    try {
        await db.query(
            'INSERT INTO announcements (title, content, target_grade) VALUES ($1, $2, $3)',
            [title, content, targetGrade]
        );
        res.status(201).json({ message: "Announcement posted successfully!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;