const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async function handler(req, res) {
  if (req.method === 'POST') {
    // your mark logic here
  }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*');

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  res.status(405).json({ message: "Method not allowed" });
};