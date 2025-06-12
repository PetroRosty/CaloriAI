import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import { VercelRequest, VercelResponse } from '@vercel/node';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface TelegramAuthData {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  hash: string;
  auth_date: number;
  photo_url?: string;
  language_code?: string;
  [key: string]: any;
}

function checkTelegramHash(data: TelegramAuthData, botToken: string): boolean {
  const { hash, ...userData } = data;
  if (!hash) return false;
  const dataCheckArr = Object.keys(userData)
    .sort()
    .map(k => `${k}=${userData[k]}`);
  const dataCheckString = dataCheckArr.join('\n');
  const secretKey = crypto.createHash('sha256').update(botToken).digest();
  const hmac = crypto.createHmac('sha256', secretKey);
  hmac.update(dataCheckString);
  const calculatedHash = hmac.digest('hex');
  return calculatedHash === hash;
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
): Promise<VercelResponse> {
  console.log('Telegram auth handler triggered');
  console.log('VITE_SUPABASE_URL:', process.env.VITE_SUPABASE_URL ? '[SET]' : '[NOT SET]');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? '[SET]' : '[NOT SET]');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let userData: TelegramAuthData;
  try {
    userData = req.body as TelegramAuthData;

    const requiredFields = ['id', 'first_name', 'hash', 'auth_date'] as const;
    const missingFields = requiredFields.filter(field => !userData[field as keyof TelegramAuthData]);

    if (missingFields.length > 0) {
      console.error('Missing fields in Telegram data:', missingFields);
      return res.status(400).json({ error: 'missing_fields', details: missingFields });
    }

    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      console.error('TELEGRAM_BOT_TOKEN is not set');
      return res.status(500).json({ error: 'server_config', details: 'TELEGRAM_BOT_TOKEN not set' });
    }

    if (!checkTelegramHash(userData, botToken)) {
      console.error('Invalid hash');
      return res.status(400).json({ error: 'invalid_hash' });
    }

    const authDate = userData.auth_date;
    const now = Math.floor(Date.now() / 1000);
    if (now - authDate > 3600) {
      console.error('Auth data expired');
      return res.status(400).json({ error: 'expired' });
    }

    const { data, error: upsertError } = await supabase
      .from('profiles')
      .upsert({
        telegram_id: userData.id,
        first_name: userData.first_name,
        username: userData.username,
        locale: userData.language_code || 'en',
      }, {
        onConflict: 'telegram_id'
      }).select();

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError);
      return res.status(500).json({ error: 'database_error', details: upsertError.message });
    }

    return res.status(200).json({ success: true, user: data ? data[0] : null });
  } catch (error: any) {
    console.error('Error in telegram auth handler:', error);
    return res.status(500).json({ error: 'server_error', details: error.message });
  }
}
