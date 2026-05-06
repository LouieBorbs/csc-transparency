require('dotenv').config();
const express = require('express');
require('./api/attendance/mark');
const cors = require('cors');
const path = require('path');
const attendanceRouter = require('./api/attendance/mark');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Serve static files from public folder (must come BEFORE API routes)
app.use(express.static(path.join(__dirname, 'public')));

// API routes (more specific paths first)
app.use('/api/attendance', require('./api/attendance/mark'));

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'CSC Attendance API is running' });
});

// Catch-all: serve index.html for SPA client-side routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Error handling (should be last)
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

// Export for Vercel/serverless
module.exports = app;
// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Internal server error'
    });
});

