import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { type, name, email, message } = req.body;

  if (!message || !name || !email) {
    return res.status(400).json({ error: 'Name, email and message are required.' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'calori.ai@yandex.com',
      to: 'calori.ai@yandex.com',
      subject: `Новое сообщение с сайта Calori.AI - ${type || 'Обратная связь'}`,
      html: `
        <h2>Новое сообщение с сайта Calori.AI</h2>
        <p><strong>Тип сообщения:</strong> ${type || 'Обратная связь'}</p>
        <p><strong>Имя:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Сообщение:</strong></p>
        <p>${message}</p>
      `,
      text: `
Новое сообщение с сайта Calori.AI

Тип сообщения: ${type || 'Обратная связь'}
Имя: ${name}
Email: ${email}

Сообщение:
${message}
      `,
    });

    if (error) {
      console.error('Resend email error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ error: error.message });
  }
} 