const express = require('express');
const cors = require('cors');
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
app.use(express.static(__dirname));

// API routes
app.use('/api/attendance', attendanceRouter);

// Health check
app.get('/', (req, res) => {
    res.json({ status: 'ok', message: 'CSC Attendance API is running' });
});

// Error handling
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