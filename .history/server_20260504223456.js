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
app.use(express.static('public'));
// API routes
app.use('/api/attendance', attendanceRouter);
// Serve index.html for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
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