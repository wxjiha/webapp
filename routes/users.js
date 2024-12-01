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
    const { userName, password } = req.body;

    // Query the database to find the user by username
    db.query(
        'SELECT hashed_password FROM users WHERE userName = ?',
        [username],
        (err, results) => {
            if (err) {
                next(err)
            }

            if (results.length === 0) {
                // No user found with the given username
                return res.send('Login failed: Invalid username or password.');
            }

            // Compare the entered password with the hashed password from the database
            const hashedPassword = results[0].hashed_password;

            bcrypt.compare(password, hashedPassword, (err, result) => {
                if (err) {
                    next(err)
                }

                if (result == true) {
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
            next(err)
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

// Route to display the list of users 
router.get('/users/list', function (req, res, next) {
    // SQL query to fetch user details excluding hashed passwords
    let sqlquery = "SELECT userName, email FROM users"

    // Execute the query
    db.query(sql, (err, results) => {
        if (err) {
            next(err)
        }

        // Render the users list page with the fetched data
        res.render('userlist.ejs', { users: results });
    });
});


// Export the router object so index.js can access it
module.exports = router;