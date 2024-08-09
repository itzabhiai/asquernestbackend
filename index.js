const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors middleware

const app = express();
const port = process.env.PORT || 5000;

// Use the cors middleware to allow cross-origin requests
app.use(cors({
  origin: 'https://asquarenest.com', 
  methods: ['GET', 'POST'],
}));

app.use(bodyParser.json());

app.post('/api/book', async (req, res) => {
  const { fullName, email, mobileNumber } = req.body;

  try {
    const fetch = (await import('node-fetch')).default;

    const webhookUrl = 'https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTY0MDYzNjA0MzI1MjZjNTUzNzUxM2Ei_pc';

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName, email, mobileNumber }),
    });

    if (response.ok) {
      res.status(200).json({ message: 'Form data sent successfully!' });
    } else {
      throw new Error(`Webhook error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error sending data to Pabbly webhook:', error);
    res.status(500).json({ error: 'Failed to send data to Pabbly webhook' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
