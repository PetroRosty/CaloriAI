import type { NextApiRequest, NextApiResponse } from 'next';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { message, from } = req.body;

  if (!message || !from) {
    return res.status(400).json({ error: 'Message and sender are required.' });
  }

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'Calori.AI@yandex.com',
      subject: 'Новое сообщение с сайта Calori.AI',
      html: `
        <p><strong>Сообщение:</strong> ${message}</p>
        <p><strong>От пользователя:</strong> ${from}</p>
      `,
      text: `Сообщение: ${message}\n\nОт пользователя: ${from}.`,
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