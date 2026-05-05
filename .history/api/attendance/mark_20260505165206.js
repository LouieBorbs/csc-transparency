const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// POST /api/attendance/mark
router.post('/mark', async (req, res) => {
  const { qrData, studentId, timestamp } = req.body;
  if (!qrData || !studentId)
    return res.json({ success: false, message: 'Missing qrData or studentId' });

  let sessionId, eventName = 'Unknown Event', expiresAt = null;

  try {
    const payload = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
    if (payload.sessionId) {
      sessionId = payload.sessionId;
      eventName = payload.eventName || eventName;
      expiresAt = payload.expiresAt || null;
    }
  } catch (e) {
    const str = String(qrData);
    if (str.startsWith('CSC:')) {
      const parts = str.substring(4).split('|');
      sessionId = parts[0];
      try { eventName = decodeURIComponent(parts[parts.length - 1]); }
      catch (e2) { eventName = parts[parts.length - 1]; }
    } else {
      sessionId = str;
    }
  }

  if (!sessionId)
    return res.json({ success: false, message: 'Invalid QR code' });

  if (expiresAt && new Date() > new Date(expiresAt))
    return res.json({ success: false, message: 'QR code has expired' });

  // Check duplicate
  const { data: existing } = await supabase
    .from('attendance_records')
    .select('id')
    .eq('session_id', sessionId)
    .eq('student_id', studentId)
    .maybeSingle();

  if (existing)
    return res.json({ success: false, message: 'Attendance already marked for this session' });

  // Insert record
  const record = {
    id: Date.now().toString(),
    session_id: sessionId,
    student_id: studentId,
    event_name: eventName,
    marked_at: timestamp || new Date().toISOString()
  };

  const { error } = await supabase.from('attendance_records').insert(record);
  if (error) return res.json({ success: false, message: error.message });

  return res.json({ success: true, message: 'Attendance marked successfully', data: record });
});

// GET /api/attendance/mark
router.get('/mark', async (req, res) => {
  const { data, error } = await supabase.from('attendance_records').select('*');
  if (error) return res.json({ success: false, message: error.message });
  res.json({ success: true, records: data });
});

// POST /api/attendance/generate-qr
router.post('/generate-qr', async (req, res) => {
  const { expiresInMinutes = 60, eventName = 'Event' } = req.body;
  const sessionId = 'SESS_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const expiresAt = new Date(Date.now() + expiresInMinutes * 60 * 1000).toISOString();

  await supabase.from('qr_codes').insert({
    id: sessionId, session_id: sessionId,
    event_title: eventName, expires_at: expiresAt
  });

  return res.json({
    success: true,
    sessionId,
    qrPayload: JSON.stringify({ sessionId, expiresAt, eventName }),
    expiresAt
  });
});

// DELETE /api/attendance/mark/all
router.delete('/mark/all', async (req, res) => {
  await supabase.from('attendance_records').delete().neq('id', '');
  return res.json({ success: true, message: 'All attendance records cleared' });
});

module.exports = router;