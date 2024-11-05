// server.js

const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')('your_stripe_secret_key'); // Replace with your Stripe secret key
const axios = require('axios'); // For making requests to Printify

const app = express();
const PORT = 3000;

// Middleware for handling raw body to validate webhook signatures
app.use(
  bodyParser.raw({ type: 'application/json' })
);

// Endpoint for Stripe webhook
app.post('/webhook', async (req, res) => {
  const endpointSecret = 'your_stripe_webhook_secret'; // Replace with your actual webhook secret

  // Verify Stripe's signature to ensure it’s a legitimate request
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Process specific event types
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Extract necessary data from session
    const lineItems = session.display_items.map(item => ({
      product_id: item.custom.product_id,
      quantity: item.quantity,
    }));

    // Fulfill the order with Printify
    await fulfillOrderWithPrintify(session, lineItems);

    console.log('Order fulfilled!');
  }

  // Respond to Stripe with 200 OK status
  res.status(200).end();
});

// Function to fulfill an order with Printify
async function fulfillOrderWithPrintify(session, lineItems) {
  const printifyApiKey = 'your_printify_api_key'; // Replace with your Printify API key

  const orderData = {
    items: lineItems,
    address_to: {
      first_name: session.customer_details.name.split(' ')[0],
      last_name: session.customer_details.name.split(' ')[1] || '',
      email: session.customer_details.email,
      phone: session.customer_details.phone,
      address1: session.shipping.address.line1,
      city: session.shipping.address.city,
      region: session.shipping.address.state,
      country: session.shipping.address.country,
      zip: session.shipping.address.postal_code,
    },
  };

  try {
    const response = await axios.post('https://api.printify.com/v1/shops/YOUR_SHOP_ID/orders.json', orderData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${printifyApiKey}`,
      },
    });
    console.log('Printify Order Response:', response.data);
  } catch (error) {
    console.error('Error fulfilling order with Printify:', error.message);
  }
}

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
