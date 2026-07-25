require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Debug environment variables
console.log('🔍 Environment Variables Check:');
console.log('BOT_TOKEN:', process.env.BOT_TOKEN ? '✅ Set' : '❌ Not set');
console.log('WEB_APP_URL:', process.env.WEB_APP_URL ? '✅ Set' : '❌ Not set');
console.log('GOOGLE_AI_API_KEY:', process.env.GOOGLE_AI_API_KEY ? '✅ Set' : '❌ Not set');

// Telegram Bot Token
const BOT_TOKEN = process.env.BOT_TOKEN;
const WEB_APP_URL = process.env.WEB_APP_URL;

// Create Telegram bot instance
const bot = new TelegramBot(BOT_TOKEN, { polling: false });

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// Webhook endpoint
app.post(`/bot/${BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Set webhook with better error handling
if (BOT_TOKEN && WEB_APP_URL) {
  const webhookUrl = `${WEB_APP_URL}/bot/${BOT_TOKEN}`;
  console.log('Setting webhook to:', webhookUrl);
  
  bot.setWebHook(webhookUrl).then(() => {
    console.log('✅ Webhook set successfully');
  }).catch((err) => {
    console.error('❌ Error setting webhook:', err.message);
    console.error('Full error:', err);
  });
} else {
  console.error('❌ Missing BOT_TOKEN or WEB_APP_URL');
  console.log('BOT_TOKEN:', BOT_TOKEN ? 'Set' : 'Not set');
  console.log('WEB_APP_URL:', WEB_APP_URL ? 'Set' : 'Not set');
}

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  const webAppUrl = `${WEB_APP_URL}?startapp=${chatId}`;
  
  bot.sendMessage(chatId, '🎉 Welcome to Asragram! Click the button below to open the app:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: '🚀 Open Asragram',
            web_app: { url: webAppUrl }
          }
        ]
      ]
    }
  });
});

// Handle /help command
bot.onText(/\/help/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, `
🤖 *Asragram Bot Help*

/start - Open the Asragram web app
/help - Show this help message

The web app allows you to:
- Select baked goods images
- Get AI-powered recipes and analysis
- Use Google Gemini AI for image recognition
  `, { parse_mode: 'Markdown' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Asragram server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Web App URL: ${WEB_APP_URL}`);
});
