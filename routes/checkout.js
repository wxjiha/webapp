require('dotenv').config();
const express = require('express');
const Stripe = require('stripe');
const router = express.Router();
const db = require('../db');


const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/basket', async (req, res) => {
    try {
        const basketItems = req.session.basket || []; // Retrieve basket from session

        // If the basket is empty, render with an empty products array
        if (basketItems.length === 0) {
            return res.render('basket', { 
                products: [], // Pass empty products array
                publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51QURwHCr8lIdfj62jyCUPtor1lGcSvgk2tdZhJWIQTiGJXZtLlvmreRxDYzu1jG4ZMqK9YdWkxk1XNLgyT8kikK000nYQkqgps' 
            });
        }

        // Extract product IDs from basket items
        const productIds = basketItems.map(item => item.productId);

        // Fetch products from the database
        const [rows] = await db.query('SELECT * FROM items WHERE id IN (?)', [productIds]);

        // Combine product details with basket quantities
        const products = rows.map(product => {
            const basketItem = basketItems.find(item => item.productId === product.id);
            return { ...product, quantity: basketItem.quantity };
        });

        // Render basket view with fetched products
        res.render('basket', { 
            products, // Pass products array
            publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_51QURwHCr8lIdfj62jyCUPtor1lGcSvgk2tdZhJWIQTiGJXZtLlvmreRxDYzu1jG4ZMqK9YdWkxk1XNLgyT8kikK000nYQkqgps' 
        });
    } catch (error) {
        console.error('Error fetching basket items:', error.message);
        res.status(500).send('An error occurred while fetching the basket.');
    }
});





// Handle checkout
router.post('/checkout', async (req, res) => {
    try {
        const basketItems = req.session.basket || []; // Retrieve basket from session

        if (basketItems.length === 0) {
            return res.redirect('/basket');
        }

        // Calculate total amount
        let totalAmount = 0;
        for (let item of basketItems) {
            const [rows] = await db.query('SELECT price FROM items WHERE id = ?', [item.productId]);
            if (rows.length > 0) {
                totalAmount += rows[0].price * item.quantity;
            }
        }

        // Create a payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount, // In cents
            currency: 'gbp',
        });

        // Clear basket after successful payment
        req.session.basket = [];

        res.redirect(`/confirmation?paymentIntentId=${paymentIntent.id}`);
    } catch (error) {
        console.error('Error during checkout:', error);
        res.status(500).send('Checkout failed.');
    }
});


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
    try {
        const { amount } = req.body;
        if (!amount) return res.status(400).send({ error: 'Invalid amount' });

        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'gbp',
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error creating payment intent:', error.message);
        res.status(500).send({ error: error.message });
    }
});


module.exports = router;
