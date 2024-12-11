// Import express and ejs
var express = require ('express')
var ejs = require('ejs')

//Import modules
var mysql = require('mysql2')
var session = require ('express-session')
var validator = require ('express-validator');
const expressSanitizer = require('express-sanitizer');

// Create the express application object
const app = express()
const port = 8000


// Tell Express that we want to use EJS as the templating engine
app.set('view engine', 'ejs')

// Set up the body parser 
app.use(express.urlencoded({ extended: true }))

// Set up public folder (for css and statis js)
app.use(express.static(__dirname + '/public'))

// Create a session
app.use(session({
    secret: 'somerandomstuff',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))


// Define the database connection
const db = mysql.createConnection ({
    host: 'localhost',
    user: 'app_user',
    password: 'qwerty',
    database: 'webapp'
})
// Connect to the database
db.connect((err) => {
    if (err) {
        throw err
    }
    console.log('Connected to database')
})
global.db = db

// Define our application-specific data
app.locals.shopData = {shopName: "Spendaholic"}

// Load the route handlers
const mainRoutes = require("./routes/main")
app.use('/', mainRoutes)

// Load the route handlers for /users
const usersRoutes = require('./routes/users')
app.use('/users', usersRoutes)

// Load the route handlers for /products
const productsRoutes = require('./routes/products')
app.use('/products', usersRoutes)


// // Load the route handlers for /login
// const loginRouter = require('./users/login'); 
// app.use('/login', usersRoutes);

// Middleware to ensure the user is logged in
function redirectLogin(req, res, next) {
    if (!req.session.userId) {
        res.redirect('/login');
    } else {
        next();
    }
}


function isAuthenticated(req, res, next) {
    if (req.session.user) {
      return next();
    }
    res.redirect('/login');
}

app.use(expressSanitizer());
// Start the web app listening
app.listen(port, () => console.log(`Node app listening on port ${port}!`))