import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { plan, days = 7, code } = req.body;

  const codes = {
    "ILOVEBACON&TEA": "station",
    "FREEBACON": "free",
    "BACON20": null,
    "BACON50": null
  };

  if (code && code in codes) {
    if (codes[code]) plan = codes[code];
  } else if (code) {
    return res.status(400).json({ error: 'Code invalide' });
  }

  const jwt = (req.headers.authorization || '').replace('Bearer ', '');
  if (!jwt) return res.status(401).json({ error: 'Token manquant' });

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
  const { data: user } = await supabase.auth.getUser(jwt);
  if (!user?.user) return res.status(401).json({ error: 'User invalide' });

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + days);

  const { error } = await supabase
    .from('user_access')
    .upsert({ user_id: user.user.id, plan, active: true, expires_at: expiresAt.toISOString() });

  if (error) return res.status(500).json({ error: error.message });
  return res.status(200).json({ ok: true, plan });
}
