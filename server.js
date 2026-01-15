const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Test route (VERY IMPORTANT)
app.get('/', (req, res) => {
  res.send('MarkisConnects backend is LIVE ✅');
});

// Order route (example – adjust payload later)
app.post('/api/order-data', async (req, res) => {
  const { phone, network, bundle } = req.body;

  if (!phone || !network || !bundle) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  try {
    const response = await fetch('https://remadata.com/api/order', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.REMA_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        phone,
        network,
        bundle
      })
    });

    const data = await response.json();
    res.json(data);

  } catch (error) {
    console.error('Order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// IMPORTANT: Render needs this
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
