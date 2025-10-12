require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;
const MODE = process.env.MODE || 'SECURE';
const MAX_MESSAGE_LENGTH = 2000;
const RECAPTCHA_SECRET = process.env.RECAPTCHA_SECRET;

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// utils
const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// middleware
app.use(express.json());

if (MODE === 'SECURE') {
  console.log('Running in SECURE mode');
  app.use(cors({ origin: ['https://xwalfie-smr.github.io', 'http://localhost:5500'] }));
  app.use(helmet());
  app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 50 }));
} else if (MODE === 'LAB') {
  console.log('Running in LAB mode');
  app.use(cors());
} else {
  console.log(`Running in UNKNOWN mode: ${MODE}`);
}

// health check
app.get('/healthz', (req, res) => res.send('OK'));

// AI verification
async function verifyMessageWithAI({ name, email, message }) {
  try {
    const prompt = `
You are a message validator for a portfolio contact form.
Decide if this message is legitimate and safe to forward. 
Respond only with "APPROVE" or "REJECT".

Name: ${name}
Email: ${email}
Message: ${message}
`;
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0,
    });

    const aiReply = response.data.choices[0].message.content.trim().toUpperCase();
    return aiReply === 'APPROVE';
  } catch (err) {
    console.error('AI verification error:', err);
    return false;
  }
}

// contact endpoint
app.post('/api/contact', async (req, res) => {
  const { name, email, message, recaptchaToken } = req.body;
  const ip = req.ip;

  if (!name || !email || !message || !recaptchaToken) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ error: 'Invalid email' });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ error: `Message too long (max ${MAX_MESSAGE_LENGTH} chars)` });
  }

  // recaptcha v3 verification
  try {
    const recaptchaRes = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${RECAPTCHA_SECRET}&response=${recaptchaToken}&remoteip=${ip}`,
    });
    const recaptchaData = await recaptchaRes.json();
    if (!recaptchaData.success || recaptchaData.score < 0.5) {
      return res.status(400).json({ error: 'Failed recaptcha verification' });
    }
  } catch (err) {
    console.error('Recaptcha error:', err);
    return res.status(500).json({ error: 'Recaptcha verification failed' });
  }

  // AI verification
  const isApproved = await verifyMessageWithAI({ name, email, message });
  if (!isApproved) {
    console.log('Message rejected by AI:', { name, email, message });
    return res.status(400).json({ error: 'Message rejected: seems spammy or invalid' });
  }

  // log message
  console.log(`New message from ${ip}:`, { name, email, message });

  // send email via Resend
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Portfolio Contact <onboarding@resend.dev>',
        to: process.env.EMAIL_TO,
        subject: `New message from ${name}`,
        html: `
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Message:</strong> ${message}</p>
          <hr>
          <p>This message was sent from your portfolio.</p>
        `,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Resend API error:', data);
      return res.status(500).json({ error: 'Failed to send email via Resend' });
    }

    return res.json({ success: true, emailSent: true });
  } catch (error) {
    console.error('Error sending email via Resend:', error);
    return res.status(500).json({ error: 'Resend API request failed' });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}, MODE=${MODE}`));
