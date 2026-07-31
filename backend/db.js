const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error connecting to Supabase Database:', err.stack);
    }
    console.log('Connected to Supabase PostgreSQL successfully!');
    release();
});

module.exports = {
    query: (text, params) => pool.query(text, params),
};