const express = require('express');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = 3000;

// Serve static files from the root directory
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/config', (req, res) => {
  res.json({ webhookUrl: process.env.DISCORD_WEBHOOK_URL });
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
