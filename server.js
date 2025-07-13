const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static(__dirname));

// Add CORS headers for the config endpoint
app.use('/config', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/config', (req, res) => {
  console.log('Webhook URL:', process.env.DISCORD_WEBHOOK_URL); // Debug log
  res.json({ webhookUrl: process.env.DISCORD_WEBHOOK_URL });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('Environment loaded:', !!process.env.DISCORD_WEBHOOK_URL);
});
