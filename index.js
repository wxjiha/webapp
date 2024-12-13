// Import express and ejs
const express = require('express');
const ejs = require('ejs');

// Import modules
const mysql = require('mysql2/promise');
const session = require('express-session');
const expressSanitizer = require('express-sanitizer');

const cors = require('cors');
const db = require('./db');

// Import route handlers
const productsRoutes = require('./routes/products'); // Products routes
const checkoutRoutes = require('./routes/checkout'); // Checkout and basket routes
const mainRoutes = require('./routes/main'); // Main routes
const usersRoutes = require('./routes/users'); // User-related routes

// Create the express application object
const app = express();
const port = 8000;

// // Tell Express that we want to use EJS as the templating engine
// app.set('view engine', 'ejs');

// Set up the body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up public folder (for CSS and static JS)
app.use(express.static(__dirname + '/public'));

app.use(cors());
// app.use(express.json());

// Create a session
app.use(session({
    secret: 'randomstuff',
    resave: false,
    saveUninitialized: false,
    // cookie: {expires: 600000},
    cookie: { secure: false }
}));

// Middleware to sanitize inputs
app.use(expressSanitizer());

// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs');

// Test the database connection
(async () => {
    try {
        const [rows] = await db.query('SELECT 1');
        console.log('Database connection successful:', rows);
    } catch (error) {
        console.error('Database connection error:', error.message);  // Log connection error details
    }
})();


if (process.env.NODE_ENV !== 'production') {
    console.log("Running in development mode");
}

// Define our application-specific data
app.locals.shopData = { shopName: "Shopaholic" };

app.use('/', mainRoutes); // Main routes
app.use('/users', usersRoutes); // User-related routes
app.use('/products', productsRoutes); // Products-related routes
app.use('/', checkoutRoutes); // Checkout and basket routes

// Middleware to ensure the user is logged in
function redirectLogin(req, res, next) {
    if (!req.session.userId) {
        res.redirect('/login');
    } else {
        next();
    }
}

// Middleware to check if the user is authenticated
function isAuthenticated(req, res, next) {
    if (req.session.user) {
        return next();
    }
    res.redirect('/login');
}


// Global error-handling middleware
app.use((err, req, res, next) => {
    console.error("Error occurred:", err.message);
    console.error("Error Stack:", err.stack);

    // Send a detailed error message only in development
    if (process.env.NODE_ENV === 'development') {
        res.status(err.status || 500).send(`Error: ${err.message}`);
    } else {
        res.status(err.status || 500).send('Something went wrong! Please try again later.');
    }
});

// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`));
