require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    if (req.method === 'POST') {
      const { qrData, studentId, timestamp } = req.body || {};

      if (!studentId) return res.status(400).json({ success: false, message: 'Missing studentId' });
      if (!qrData) return res.status(400).json({ success: false, message: 'Missing qrData' });

      let sessionId = null;
      let eventName = 'Unknown Event';
      let expiresAt = null;

      try {
        const parsed = typeof qrData === 'string' ? JSON.parse(qrData) : qrData;
        if (parsed && parsed.sessionId) {
          sessionId = parsed.sessionId;
          eventName = parsed.eventName || eventName;
          expiresAt = parsed.expiresAt || null;
        }
      } catch (e) {
        const str = String(qrData);
        if (str.startsWith('CSC:')) {
          const parts = str.substring(4).split('|');
          sessionId = parts[0] || null;
          eventName = parts[parts.length - 1] || eventName;
        }
      }

      if (!sessionId) return res.status(400).json({ success: false, message: 'Invalid QR code format' });
      if (expiresAt && new Date(expiresAt) < new Date()) return res.status(400).json({ success: false, message: 'QR code has expired' });

      const { data: existing } = await supabase
        .from('attendance_records')
        .select('id')
        .eq('student_id', String(studentId))
        .eq('session_id', sessionId)
        .maybeSingle();

      if (existing) return res.status(400).json({ success: false, message: 'Attendance already marked for this session' });

      const { data, error } = await supabase.from('attendance_records').insert({
        student_id: String(studentId),
        session_id: sessionId,
        event_name: eventName,
        status: 'present',
        marked_at: timestamp || new Date().toISOString()
      }).select();

      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.status(200).json({ success: true, data: data ? data[0] : null });
    }

    if (req.method === 'GET') {
      const { data, error } = await supabase.from('attendance_records').select('*').order('marked_at', { ascending: false });
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.status(200).json({ success: true, data: data || [] });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });

  } catch (err) {
    console.error('Attendance API error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error: ' + err.message });
  }
};
