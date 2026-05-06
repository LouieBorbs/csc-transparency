const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

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

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const urlPath = (req.url || '').replace(/^\/api\/data\/?/, '').replace(/\?.*$/, '');
  const parts = urlPath.split('/').filter(Boolean);
  const segment = parts[0];
  const id = parts[1];

  try {
    if (segment === 'finance') {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('finance').select('*').eq('id', 'main').maybeSingle();
        if (error) return res.status(500).json({ success: false, message: error.message });
        return res.status(200).json({ success: true, data: data || { currentFunds: 0, transactions: [] } });
      }
      if (req.method === 'PUT') {
        const { error } = await supabase.from('finance').upsert({ id: 'main', ...req.body, updated_at: new Date().toISOString() });
        if (error) return res.status(500).json({ success: false, message: error.message });
        return res.status(200).json({ success: true });
      }
    }

    if (segment === 'positionMappings') {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('position_mappings').select('*').eq('id', 'main').maybeSingle();
        if (error) return res.status(500).json({ success: false, message: error.message });
        return res.status(200).json({ success: true, data: (data && data.mappings) ? data.mappings : {} });
      }
      if (req.method === 'PUT') {
        const { error } = await supabase.from('position_mappings').upsert({ id: 'main', mappings: req.body || {} });
        if (error) return res.status(500).json({ success: false, message: error.message });
        return res.status(200).json({ success: true });
      }
    }

    const table = TABLES[segment];
    if (!table) return res.status(404).json({ success: false, message: 'Unknown table: ' + segment });

    if (req.method === 'GET') {
      const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: true });
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.status(200).json({ success: true, data: data || [] });
    }

    if (req.method === 'POST') {
      if (!req.body) return res.status(400).json({ success: false, message: 'Missing request body' });
      const { data, error } = await supabase.from(table).insert(req.body).select();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.status(200).json({ success: true, data: data ? data[0] : null });
    }

    if (req.method === 'PUT') {
      if (!id) return res.status(400).json({ success: false, message: 'Missing ID' });
      const { data, error } = await supabase.from(table).update(req.body).eq('id', id).select();
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.status(200).json({ success: true, data: data ? data[0] : null });
    }

    if (req.method === 'DELETE') {
      if (!id) return res.status(400).json({ success: false, message: 'Missing ID' });
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) return res.status(500).json({ success: false, message: error.message });
      return res.status(200).json({ success: true });
    }

    return res.status(405).json({ success: false, message: 'Method not allowed' });

  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error: ' + err.message });
  }
};
