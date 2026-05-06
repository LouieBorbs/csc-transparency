const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Maps frontend data names → Supabase table names
const TABLES = {
  users: 'users',
  events: 'events',
  announcements: 'announcements',
  files: 'files',
  polls: 'polls',
  suggestions: 'suggestions',
  complaints: 'complaints',
  notifications: 'notifications',
  messages: 'messages',
  comments: 'comments',
  headlines: 'headlines',
  postRequests: 'post_requests',
  mediaContent: 'media_content',
  qrCodes: 'qr_codes',
  auditLogs: 'audit_logs',
  activities: 'activities',
  batches: 'batches',
  organizations: 'organizations',
  reportFiles: 'report_files',
  attendanceRecords: 'attendance_records'
};

// GET /api/data/finance
router.get('/finance', async (req, res) => {
  const { data, error } = await supabase.from('finance').select('*').eq('id', 'main').maybeSingle();
  if (error) {
  console.error('Supabase error:', error.message, '| Table:', table || 'finance/positionMappings');
  return res.status(500).json({ success: false, message: error.message });
}
  res.json({ success: true, data });
});

// PUT /api/data/finance
router.put('/finance', async (req, res) => {
  const { error } = await supabase.from('finance').update({ ...req.body, updated_at: new Date().toISOString() }).eq('id', 'main');
  if (error) {
  console.error('Supabase error:', error.message, '| Table:', table || 'finance/positionMappings');
  return res.status(500).json({ success: false, message: error.message });
}
  res.json({ success: true });
});

// GET /api/data/positionMappings
router.get('/positionMappings', async (req, res) => {
  const { data, error } = await supabase.from('position_mappings').select('*').eq('id', 'main').maybeSingle();
  if (error) {
  console.error('Supabase error:', error.message, '| Table:', table || 'finance/positionMappings');
  return res.status(500).json({ success: false, message: error.message });
}
  res.json({ success: true, data: data ? data.mappings : {} });
});

// PUT /api/data/positionMappings
router.put('/positionMappings', async (req, res) => {
  const { error } = await supabase.from('position_mappings').update({ mappings: req.body }).eq('id', 'main');
 if (error) {
  console.error('Supabase error:', error.message, '| Table:', table || 'finance/positionMappings');
  return res.status(500).json({ success: false, message: error.message });
}
  res.json({ success: true });
});

// GET /api/data/:table — get all rows
router.get('/:table', async (req, res) => {
  const table = TABLES[req.params.table];
  if (!table) return res.status(404).json({ success: false, message: 'Unknown table: ' + req.params.table });
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: true });
  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, data: data || [] });
});

// POST /api/data/:table — insert row
router.post('/:table', async (req, res) => {
  const table = TABLES[req.params.table];
  if (!table) return res.status(404).json({ success: false, message: 'Unknown table: ' + req.params.table });
  const { data, error } = await supabase.from(table).insert(req.body).select();
  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, data: data ? data[0] : null });
});

// PUT /api/data/:table/:id — update row
router.put('/:table/:id', async (req, res) => {
  const table = TABLES[req.params.table];
  if (!table) return res.status(404).json({ success: false, message: 'Unknown table: ' + req.params.table });
  const { data, error } = await supabase.from(table).update(req.body).eq('id', req.params.id).select();
  if (error) return res.status(500).json({ success: false, message: error.message });
  res.json({ success: true, data: data ? data[0] : null });
});

// DELETE /api/data/:table/:id — delete row
router.delete('/:table/:id', async (req, res) => {
  const table = TABLES[req.params.table];
  if (!table) return res.status(404).json({ success: false, message: 'Unknown table: ' + req.params.table });
  const { error } = await supabase.from(table).delete().eq('id', req.params.id);
  if (error) {
  console.error('Supabase error:', error.message, '| Table:', table || 'finance/positionMappings');
  return res.status(500).json({ success: false, message: error.message });
}
  res.json({ success: true });
});

module.exports = router;