const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  const htmlPath = path.join(__dirname, 'index.html');
  let html = fs.readFileSync(htmlPath, 'utf8');
  
  // Inject webhook URL into the HTML
  html = html.replace('{{DISCORD_WEBHOOK_URL}}', process.env.DISCORD_WEBHOOK_URL || '');
  
  res.send(html);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('Webhook configured:', !!process.env.DISCORD_WEBHOOK_URL);
});
