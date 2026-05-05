const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const TABLE_MAP = {
  users: 'users',
  events: 'events',
  announcements: 'announcements',
  polls: 'polls',
  suggestions: 'suggestions',
  complaints: 'complaints',
  files: 'files',
  notifications: 'notifications',
  messages: 'messages',
  comments: 'comments',
  headlines: 'headlines',
  postrequests: 'post_requests',
  postRequests: 'post_requests',
  mediacontent: 'media_content',
  mediaContent: 'media_content',
  attendancerecords: 'attendance_records',
  attendanceRecords: 'attendance_records',
  qrcodes: 'qr_codes',
  qrCodes: 'qr_codes',
  auditlogs: 'audit_logs',
  auditLogs: 'audit_logs',
  activities: 'activities',
  batches: 'batches',
  organizations: 'organizations',
  reportfiles: 'files',
  reportFiles: 'files',
  finance: 'finance'
};

function getTable(tableName) {
  const normalized = tableName.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
  return TABLE_MAP[normalized] || TABLE_MAP[tableName] || tableName;
}

// POST /api/data/batch - batch operations
router.post('/batch', async (req, res) => {
  const { operations } = req.body;
  if (!Array.isArray(operations)) {
    return res.status(400).json({ success: false, message: 'operations must be an array' });
  }

  const results = [];
  for (const op of operations) {
    const { type, table, data, id, filters } = op;
    const tableName = getTable(table);
    try {
      if (type === 'insert') {
        const { data: inserted, error } = await supabase.from(tableName).insert(data).select();
        if (error) throw error;
        results.push({ success: true, data: inserted });
      } else if (type === 'update') {
        let query = supabase.from(tableName).update(data);
        if (id) query = query.eq('id', id);
        else if (filters) query = query.match(filters);
        const { data: updated, error } = await query.select();
        if (error) throw error;
        results.push({ success: true, data: updated });
      } else if (type === 'delete') {
        let query = supabase.from(tableName).delete();
        if (id) query = query.eq('id', id);
        else if (filters) query = query.match(filters);
        const { error } = await query;
        if (error) throw error;
        results.push({ success: true });
      } else if (type === 'select') {
        let query = supabase.from(tableName).select('*');
        if (filters) query = query.match(filters);
        const { data: selected, error } = await query;
        if (error) throw error;
        results.push({ success: true, data: selected });
      } else {
        results.push({ success: false, message: 'Unknown operation type: ' + type });
      }
    } catch (err) {
      results.push({ success: false, message: err.message, error: err });
    }
  }

  res.json({ success: true, results });
});

// GET /api/data/:table - fetch all rows
router.get('/:table', async (req, res) => {
  const table = getTable(req.params.table);
  const { data, error } = await supabase.from(table).select('*');
  if (error) {
    return res.status(500).json({ success: false, message: error.message, data: [] });
  }
  res.json({ success: true, data: data || [] });
});

// GET /api/data/:table/filter - fetch with filters
router.get('/:table/filter', async (req, res) => {
  const table = getTable(req.params.table);
  let query = supabase.from(table).select('*');
  Object.keys(req.query).forEach(key => {
    if (key !== 'table') {
      query = query.eq(key, req.query[key]);
    }
  });
  const { data, error } = await query;
  if (error) {
    return res.status(500).json({ success: false, message: error.message, data: [] });
  }
  res.json({ success: true, data: data || [] });
});

// GET /api/data/:table/:id - fetch single row
router.get('/:table/:id', async (req, res) => {
  const table = getTable(req.params.table);
  const { data, error } = await supabase.from(table).select('*').eq('id', req.params.id).single();
  if (error) {
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
  res.json({ success: true, data });
});

// POST /api/data/:table - insert row
router.post('/:table', async (req, res) => {
  const table = getTable(req.params.table);
  const { data, error } = await supabase.from(table).insert(req.body).select();
  if (error) {
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
  res.json({ success: true, data: data[0] });
});

// PUT /api/data/:table/:id - update row
router.put('/:table/:id', async (req, res) => {
  const table = getTable(req.params.table);
  const { data, error } = await supabase.from(table).update(req.body).eq('id', req.params.id).select();
  if (error) {
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
  res.json({ success: true, data: data[0] });
});

// PATCH /api/data/:table/:id - patch row
router.patch('/:table/:id', async (req, res) => {
  const table = getTable(req.params.table);
  const { data, error } = await supabase.from(table).update(req.body).eq('id', req.params.id).select();
  if (error) {
    return res.status(500).json({ success: false, message: error.message, data: null });
  }
  res.json({ success: true, data: data[0] });
});

// DELETE /api/data/:table/:id - delete row
router.delete('/:table/:id', async (req, res) => {
  const table = getTable(req.params.table);
  const { error } = await supabase.from(table).delete().eq('id', req.params.id);
  if (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
  res.json({ success: true });
});

module.exports = router;