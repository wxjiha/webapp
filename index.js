// // Import express and ejs
// var express = require ('express')
// var ejs = require('ejs')

// //Import modules
// var mysql = require('mysql2/promise')
// var session = require ('express-session')
// var validator = require ('express-validator');
// const expressSanitizer = require('express-sanitizer');
// // const db = require('./db');

// // Create the express application object
// const app = express()
// const port = 8000


// // Tell Express that we want to use EJS as the templating engine
// app.set('view engine', 'ejs')

// // Set up the body parser 
// app.use(express.urlencoded({ extended: true }))

// // Set up public folder (for css and statis js)
// app.use(express.static(__dirname + '/public'))

// // Create a session
// app.use(session({
//     secret: 'randomstuff',
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         expires: 600000
//     }
// }))


// // Define the database connection
// const db = mysql.createConnection ({
//     host: 'localhost',
//     user: 'app_user',
//     password: 'qwerty',
//     database: 'webapp'
// })

// // const db = mysql.createPool({
// //     host: 'localhost',
// //     user: 'app_user',
// //     password: 'qwerty',
// //     database: 'webapp',
// //     waitForConnections: true,
// //     connectionLimit: 10,
// //     queueLimit: 0,
// // });



// // Connect to the database
// db.connect((err) => {
//     if (err) {
//         throw err
//     }
//     console.log('Connected to database')
// })

// global.db = db;

// // // Example query
// // (async () => {
// //     try {
// //         const [rows] = await db.query('SELECT 1');
// //         console.log('Test Query Successful:', rows);
// //     } catch (error) {
// //         console.error('Database Error:', error);
// //     }
// // })();

// // Define our application-specific data
// app.locals.shopData = {shopName: "Spendaholic"}

// // Load the route handlers
// const mainRoutes = require("./routes/main")
// app.use('/', mainRoutes)

// // Load the route handlers for /users
// const usersRoutes = require('./routes/users')
// app.use('/users', usersRoutes)

// // Load the route handlers for /products
// const productsRoutes = require('./routes/products')
// app.use('/products', usersRoutes)


// // // Load the route handlers for /login
// // const loginRouter = require('./users/login'); 
// // app.use('/login', usersRoutes);

// // Middleware to ensure the user is logged in
// function redirectLogin(req, res, next) {
//     if (!req.session.userId || !req.session.userId) {
//         res.redirect('/login');
//     } else {
//         next();
//     }
// }


// function isAuthenticated(req, res, next) {
//     if (req.session.user) {
//       return next();
//     }
//     res.redirect('/login');
// }

// app.use(expressSanitizer());
// // Start the web app listening
// app.listen(port, () => console.log(`Node app listening on port ${port}!`))


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


// Define the database connection using a pool
// const db = mysql.createPool({
//     host: 'localhost',
//     user: 'app_user',
//     password: 'qwerty',
//     database: 'webapp',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0,
// });

// Attach the database pool to the global object
// global.db = db;

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
app.locals.shopData = { shopName: "Spendaholic" };

// // Load the route handlers
// const mainRoutes = require("./routes/main");
// app.use('/', mainRoutes);

// const usersRoutes = require('./routes/users');
// app.use('/users', usersRoutes);

// const productsRoutes = require('./routes/products');
// app.use('/products', productsRoutes, checkoutRoutes);

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
