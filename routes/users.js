// Create a new router
const express = require("express")
const router = express.Router()
const bcrypt = require('bcrypt')
const saltRounds = 10
const mysql = require("mysql2");


router.get('/login', function (req, res, next) {
    res.render('login.ejs'); 
});

// Route to handle login validation
router.post('/loggedin', function (req, res, next) {
    const { username, password } = req.body;

    // Query the database to find the user by username
    pool.query(
        'SELECT hashed_password FROM users WHERE username = ?',
        [username],
        (err, results) => {
            if (err) {
                console.error('Error querying the database:', err);
                return res.status(500).send('An error occurred. Please try again later.');
            }

            if (results.length === 0) {
                // No user found with the given username
                return res.send('Login failed: Invalid username or password.');
            }

            // Compare the entered password with the hashed password from the database
            const hashedPassword = results[0].hashed_password;

            bcrypt.compare(password, hashedPassword, (err, match) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).send('An error occurred. Please try again later.');
                }

                if (match) {
                    // Passwords match, login is successful
                    res.send('Login successful! Welcome, ' + username + '!');
                } else {
                    // Passwords do not match
                    res.send('Login failed: Invalid username or password.');
                }
            });
        }
    );
});


router.get('/register', function (req, res, next) {
    res.render('register.ejs')                                                               
})    

router.post('/registered', function (req, res, next) {
    // Extracting user data
    const plainPassword = req.body.password;
    const userName = req.body.user; 
    const email = req.body.email;

    // Hashing the password
    bcrypt.hash(plainPassword, saltRounds, function (err, hashedPassword) {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('An error occurred while processing your request.');
        }

        
        console.log('User Data:', {
            userName: userName,
            email: email,
            hashedPassword: hashedPassword
        });

        // response to the user
        res.send('Hello ' + userName + ', you are now registered! We will send an email to you at ' + email);
    });
});

// Export the router object so index.js can access it
module.exports = router;