import { createClient } from '@supabase/supabase-js';
import { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const chatId = req.query.chat_id;

  if (!chatId || typeof chatId !== 'string') {
    return res.status(400).json({ error: 'chat_id is required' });
  }

  try {
    // Ищем пользователя в базе данных
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('telegram_id', chatId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!data) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.status(200).json({
      success: true,
      user: {
        telegram_id: data.telegram_id,
        first_name: data.first_name,
        last_name: data.last_name,
        username: data.username,
        photo_url: data.photo_url,
        is_pro: data.is_pro,
        created_at: data.created_at
      }
    });
  } catch (error) {
    console.error('Error in check-chat-id handler:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 