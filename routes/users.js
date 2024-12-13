// Create a new router
const express = require("express");
const mysql = require("mysql2");
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const router = express.Router();

const db = require('../db');

const redirectLogin = (req, res, next) => {
    if (!req.session.userId ) {
      res.redirect('./login') // redirect to the login page
    } else { 
        next (); // move to the next middleware function
    } 
}


router.get('/login', function (req, res, next) {
    res.render('login'); 
});

router.post('/loggedin', [
    check('username').notEmpty().withMessage('Username is required'),
    check('password').notEmpty().withMessage('Password is required')
], async function (req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
        // Query the database to find the user by username
        const [results] = await db.query('SELECT id, username, hashed_password FROM users WHERE username = ?', [username]);

        if (results.length === 0) {
            return res.status(400).send('Login failed: Invalid username or password.');
        }

        const { id, hashed_password } = results[0];

        // Compare the entered password with the hashed password
        const isMatch = await bcrypt.compare(password, hashed_password);
        if (!isMatch) {
            return res.status(400).send('Login failed: Invalid username or password.');
        }

        // Save user session on successful login
        req.session.userId = id;
        req.session.username = username;
        req.session.isLoggedIn = true;

        res.redirect('/');
    } catch (err) {
        console.error("Error during login:", err.message);
        next(err);
    }
});


router.get('/logout', redirectLogin,(req, res) => {
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
        return res.redirect('/');
      }
      res.render('logout', {message:"You've successfully logged out, you are being redirected to the home page"}); 
    });
});


router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})    


router.post('/registered',[
        check('user').notEmpty().withMessage('Username is required').isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters').trim().escape(),
        check('email').isEmail().withMessage('Invalid email address').normalizeEmail(),
        check('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters long'),
        check('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match'),
    ],
    async function (req, res, next) {
        console.log('Request Body:', req.body); // Debugging step

        const errors = validationResult(req);

        // Handle validation errors
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { user: username, email, password } = req.body; // Map 'user' to 'username'

        try {
            // Hash the password
            const hashed_password = await bcrypt.hash(password, saltRounds);

            // SQL query to insert the user into the database
            const sqlquery = 'INSERT INTO users (username, email, hashed_password) VALUES (?, ?, ?)';
            const newUser = [username, email, hashed_password];

            // Execute the query
            db.query(sqlquery, newUser, (err, result) => {
                if (err) {
                    return next(err); // Pass database errors to error-handling middleware
                }
                res.send(
                    `Hello, you are now registered with the username: ${username}. We will send an email to you at ${email}.`
                );
            });
        } catch (err) {
            next(err); // Pass hashing errors to error-handling middleware
        }
    }
);


router.get('/:id', (req, res) => {
    const userId = req.params.id;
    // Replace this with database logic
    const user = { id: userId, username: 'User1' };
    res.json(user);
});


// Export the router object so index.js can access it
module.exports = router;
module.exports.redirectLogin = redirectLogin;