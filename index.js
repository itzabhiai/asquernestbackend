const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 5000;

// CORS middleware to allow cross-origin requests
app.use(cors({
  origin: 'https://asquarenest.com', 
  methods: ['GET', 'POST'],
}));

app.use(bodyParser.json());

app.post('/api/book', async (req, res) => {
  const { fullName, email, mobileNumber } = req.body;

  try {
    console.log('Received data:', { fullName, email, mobileNumber }); // Log received data for debugging
    
    const fetch = (await import('node-fetch')).default;
    const webhookUrl = 'https://connect.pabbly.com/workflow/sendwebhookdata/IjU3NjUwNTY0MDYzNjA0MzI1MjZjNTUzNzUxM2Ei_pc';

    // Making the POST request to the webhook
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fullName, email, mobileNumber }),
    });

    const responseBody = await response.text(); // Capture the response body for debugging

    // Log the response body for debugging
    console.log('Pabbly webhook response:', responseBody);

    if (response.ok) {
      res.status(200).json({ message: 'Form data sent successfully!' });
    } else {
      console.error(`Webhook error: ${response.statusText}`);
      res.status(500).json({ error: `Webhook error: ${response.statusText}` });
    }
  } catch (error) {
    console.error('Error sending data to Pabbly webhook:', error);
    res.status(500).json({ error: 'Failed to send data to Pabbly webhook: ' + error.message });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
