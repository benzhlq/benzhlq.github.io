const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
const fetch = require('node-fetch');

dotenv.config();

const app = express();
const port = 3000;

app.use(express.static(__dirname));
app.use(express.json());

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/submit-feedback', async (req, res) => {
  const { stars, message } = req.body;
  
  if (!stars || stars < 1 || stars > 5) {
    return res.status(400).json({ error: 'Invalid star rating' });
  }

  const starsEmoji = "⭐".repeat(stars);
  const embed = {
    embeds: [
      {
        title: "Feedback",
        description: `**Stars:** ${starsEmoji}\n\n**Message:** ${message || "N/A"}`,
        color: 16776960,
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    const response = await fetch(process.env.DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(embed),
    });

    if (response.ok) {
      res.json({ success: true });
    } else {
      console.error("Discord webhook failed:", response.status);
      res.status(500).json({ error: 'Failed to submit feedback' });
    }
  } catch (error) {
    console.error("Error sending to Discord:", error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log('Webhook configured:', !!process.env.DISCORD_WEBHOOK_URL);
});
