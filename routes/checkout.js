require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const router = express.Router();

// const stripe = Stripe('sk_test_51QURwHCr8lIdfj62wKWRsoE6Y47Mrh6ONXRJnDBfkI0RnguOdw7GW9t1LWsOXuyMafAZL6qkwXsEJEL7hVrd9vPG00iPgrNcG8'); // Replace with your actual Stripe Secret Key

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Route to render confirmation page
router.get('/confirmation', async (req, res) => {
    const paymentIntentId = req.query.paymentIntentId;

    try {
        // Retrieve payment details from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        res.render('confirmation', {
            paymentIntent, // Pass payment details to the view
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while retrieving payment details.');
    }
});

router.post('/create-payment-intent', async (req, res) => {
    // const { amount, currency } = req.body; // Amount in smallest currency unit (e.g., cents)
    try {
        const { amount, currency } = req.body; // Amount in smallest currency unit (e.g., cents)

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
        });
        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

module.exports = router;
