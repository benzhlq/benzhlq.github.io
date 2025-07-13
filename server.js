const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Get webhook URL from environment (GitHub secrets)
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL || '';
  console.log('Webhook URL available:', !!webhookUrl);
  
  // Replace placeholder with actual webhook URL
  html = html.replace('{{DISCORD_WEBHOOK_URL}}', webhookUrl);
  
  res.send(html);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log('Environment:', process.env.NODE_ENV || 'development');
  console.log('Webhook configured:', !!process.env.DISCORD_WEBHOOK_URL);
});
