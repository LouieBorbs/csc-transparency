const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_KEY
);

const TABLES = {
  users: 'users', events: 'events', announcements: 'announcements',
  files: 'files', polls: 'polls', suggestions: 'suggestions',
  complaints: 'complaints', notifications: 'notifications',
  messages: 'messages', comments: 'comments', headlines: 'headlines',
  postRequests: 'post_requests', mediaContent: 'media_content',
  qrCodes: 'qr_codes', auditLogs: 'audit_logs', activities: 'activities',
  batches: 'batches', organizations: 'organizations',
  reportFiles: 'report_files', attendanceRecords: 'attendance_records'
};

// Remove internal tracking fields before sending to Supabase
function clean(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  var out = Object.assign({}, obj);
  delete out._supabase_id;
  return out;
}

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

    // ── /api/data/finance ─────────────────────────────────────────────────
    if (segment === 'finance') {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('finance').select('*').eq('id', 'main').maybeSingle();
        if (error) return res.status(500).json({ success: false, message: error.message });
        return res.status(200).json({ success: true, data: data || { currentFunds: 0, transactions: [] } });
      }
      if (req.method === 'PUT') {
        const body = req.body || {};
        const { error } = await supabase.from('finance').upsert({
          id: 'main',
          currentFunds: body.currentFunds != null ? Number(body.currentFunds) : 0,
          transactions: Array.isArray(body.transactions) ? body.transactions : [],
          updated_at: new Date().toISOString()
        });
        if (error) return res.status(500).json({ success: false, message: error.message });
        return res.status(200).json({ success: true });
      }
    }

    // ── /api/data/positionMappings ────────────────────────────────────────
    if (segment === 'positionMappings') {
      if (req.method === 'GET') {
        const { data, error } = await supabase.from('position_mappings').select('*').eq('id', 'main').maybeSingle();
        if (error) return res.status(500).json({ success: false, message: error.message });
        return res.status(200).json({ success: true, data: (data && data.mappings) ? data.mappings : {} });
      }
      if (req.method === 'PUT') {
        const { error } = await supabase.from('position_mappings').upsert({
          id: 'main', mappings: req.body || {}, updated_at: new Date().toISOString()
        });
        if (error) return res.status(500).json({ success: false, message: error.message });
        return res.status(200).json({ success: true });
      }
    }

     // ── generic tables ────────────────────────────────────────────────────
     const table = TABLES[segment];
     if (!table) return res.status(404).json({ success: false, message: 'Unknown table: ' + segment });

     if (req.method === 'GET') {
         const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: true, nullsFirst: true });
         if (error) {
             console.error('[API] GET error on', table, error);
             return res.status(500).json({ success: false, message: error.message });
         }
         return res.status(200).json({ success: true, data: data || [] });
     }

     if (req.method === 'POST') {
         if (!req.body) return res.status(400).json({ success: false, message: 'Missing body' });
         // Strip id and _supabase_id — Supabase assigns its own id
         const { id: _id, _supabase_id, created_at, ...insertBody } = clean(req.body);
         // Add created_at timestamp
         insertBody.created_at = new Date().toISOString();
         
         const { data, error } = await supabase.from(table).insert(insertBody).select();
         if (error) {
             // Check for unique constraint violation
             if (error.code === '23505') {
                 return res.status(409).json({ success: false, message: 'Duplicate record' });
             }
             console.error('[API] POST error on', table, error);
             return res.status(500).json({ success: false, message: error.message });
         }
         return res.status(201).json({ success: true, data: data ? data[0] : null });
     }

     if (req.method === 'PUT') {
         if (!id) return res.status(400).json({ success: false, message: 'Missing ID' });
         const { id: _id, _supabase_id, created_at, ...updateBody } = clean(req.body || {});
         // Add updated_at timestamp for optimistic locking
         updateBody.updated_at = new Date().toISOString();
         
         const { data, error } = await supabase.from(table).update(updateBody).eq('id', id).select();
         if (error) {
             // Row not found or other error
             if (error.code === 'PGRST116' || error.message.includes('not found')) {
                 return res.status(404).json({ success: false, message: 'Record not found' });
             }
             console.error('[API] PUT error on', table, id, error);
             return res.status(500).json({ success: false, message: error.message });
         }
         if (!data || data.length === 0) {
             return res.status(404).json({ success: false, message: 'Record not found' });
         }
         return res.status(200).json({ success: true, data: data[0] });
     }

     if (req.method === 'DELETE') {
         if (!id) return res.status(400).json({ success: false, message: 'Missing ID' });
         const { error } = await supabase.from(table).delete().eq('id', id);
         if (error) {
             console.error('[API] DELETE error on', table, id, error);
             return res.status(500).json({ success: false, message: error.message });
         }
         return res.status(200).json({ success: true });
     }

    return res.status(405).json({ success: false, message: 'Method not allowed' });

  } catch (err) {
    console.error('[api/data] error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error: ' + err.message });
  }
};
