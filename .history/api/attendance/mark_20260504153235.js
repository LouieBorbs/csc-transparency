const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// File-based storage for attendance
const DB_FILE = path.join(__dirname, '../../database/attendance.json');
const dbPath = path.join(__dirname, '../../database');

// Ensure database directory exists
if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
}

// Load existing data or initialize
function loadDatabase() {
    try {
        if (fs.existsSync(DB_FILE)) {
            const data = fs.readFileSync(DB_FILE, 'utf8');
            return JSON.parse(data);
        }
    } catch (e) {}
    return { attendanceRecords: [], qrCodes: [] };
}

function saveDatabase(data) {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

// In-memory storage (loaded from file)
let db = loadDatabase();

/**
 * POST /api/attendance/mark
 * Mark attendance for a student using scanned QR code
 * 
 * Request body: { qrData, studentId, timestamp }
 * - qrData: QR code data in format "CSC:sessionId|eventTitle" (URL-encoded)
 *   OR JSON string: {"sessionId":"...", "expiresAt":"...", "eventName":"..."}
 * - studentId: The student's ID
 * - timestamp: ISO string of when the QR was scanned
 */
router.post('/mark', (req, res) => {
    const { qrData, studentId, timestamp } = req.body;
    
    // Validate required fields
    if (!qrData || !studentId) {
        return res.json({
            success: false,
            message: 'Missing required fields: qrData or studentId'
        });
    }
    
    let sessionId;
    let eventName = 'Unknown Event';
    let expiresAt = null;
    
     // Try to parse as JSON first (new format with expiry embedded)
    let isJsonFormat = false;
    try {
        const qrPayload = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
        if (qrPayload.sessionId) {
            sessionId = qrPayload.sessionId;
            eventName = qrPayload.eventName || eventName;
            expiresAt = qrPayload.expiresAt || null;
            isJsonFormat = true;
        }
    } catch (e) {
        // Not JSON - parse the legacy "CSC:sessionId|eventTitle" or "CSC:code|id|title" format
    }
    
    if (!isJsonFormat) {
        const qrString = typeof qrData === 'string' ? qrData : String(qrData);
        
        // Expected format: "CSC:SESSION_ID|EVENT_TITLE" or "CSC:CODE|EVENT_ID|EVENT_TITLE"
        const cscPrefix = 'CSC:';
        if (qrString.startsWith(cscPrefix)) {
            const content = qrString.substring(cscPrefix.length);
            const parts = content.split('|');
            
            // Determine session ID based on number of parts
            // 2 parts: [sessionId, eventTitle]
            // 3 parts: [qrCode, eventId, eventTitle] - use qrCode as session identifier
            if (parts.length >= 2) {
                sessionId = parts[0] || null;
                // Event title is always the last part
                if (parts[parts.length - 1]) {
                    try {
                        eventName = decodeURIComponent(parts[parts.length - 1]);
                    } catch (e) {
                        eventName = parts[parts.length - 1];
                    }
                }
            } else {
                sessionId = parts[0] || null;
            }
        } else {
            // Treat as raw session ID (fallback)
            sessionId = qrString;
        }
    }
    
    // Validate sessionId exists
    if (!sessionId) {
        return res.json({
            success: false,
            message: 'Invalid QR code: missing session ID'
        });
    }
    
    // Check if QR is expired
    const now = new Date();
    const expiryDate = expiresAt ? new Date(expiresAt) : null;
    
    if (expiryDate && now > expiryDate) {
        return res.json({
            success: false,
            message: 'QR code has expired'
        });
    }
    
    // Reload database to get latest data
    db = loadDatabase();
    
    // Check if student already marked attendance for this session
    const existingRecord = db.attendanceRecords.find(
        record => record.sessionId === sessionId && record.studentId === studentId
    );
    
    if (existingRecord) {
        return res.json({
            success: false,
            message: 'Attendance already marked for this session'
        });
    }
    
    // Save attendance record
    const attendanceRecord = {
        id: Date.now().toString(),
        sessionId,
        studentId,
        eventName: eventName || 'Unknown Event',
        markedAt: timestamp || new Date().toISOString()
    };
    
    db.attendanceRecords.push(attendanceRecord);
    saveDatabase(db);
    
    return res.json({
        success: true,
        message: 'Attendance marked successfully',
        data: attendanceRecord
    });
});

/**
 * GET /api/attendance/mark
 * Get attendance records (for testing/admin purposes)
 */
router.get('/mark', (req, res) => {
    db = loadDatabase();
    res.json({
        success: true,
        records: db.attendanceRecords
    });
});

/**
 * POST /api/attendance/generate-qr
 * Generate a new QR session (for super admin to create valid QR codes)
 * 
 * Request body: { expiresInMinutes, eventName }
 */
router.post('/generate-qr', (req, res) => {
    const { expiresInMinutes = 60, eventName = 'Event' } = req.body;
    
    const sessionId = 'SESS_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString();
    
    db = loadDatabase();
    db.qrCodes.push({
        id: sessionId,
        sessionId,
        code: sessionId,
        eventTitle: eventName,
        expiresAt,
        createdAt: new Date().toISOString()
    });
    saveDatabase(db);
    
    // Return the JSON payload that should be encoded in the QR
    const qrPayload = {
        sessionId,
        expiresAt,
        eventName
    };
    
    return res.json({
        success: true,
        sessionId,
        qrPayload: JSON.stringify(qrPayload),
        expiresAt
    });
});

/**
 * DELETE /api/attendance/mark/all
 * Clear attendance records (for testing)
 */
router.delete('/mark/all', (req, res) => {
    db = loadDatabase();
    db.attendanceRecords = [];
    saveDatabase(db);
    return res.json({
        success: true,
        message: 'All attendance records cleared'
    });
});

module.exports = router;