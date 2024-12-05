// Create a new router
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { check, validationResult } = require('express-validator');

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

// Route to handle login validation
router.post('/loggedin',
    [check('username').notEmpty().withMessage('Username is required')],
    [check('password').notEmpty().withMessage('Password is required')],
    function (req, res, next) {
    req.sanitize(req.body.username)
    req.sanitize(req.body.password)
    const { username, password } = req.body;

    // Query the database to find the user by username
    db.query(
        'SELECT hashed_password FROM users WHERE username = ?',
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
            const hashed_password = results[0].hashed_password;

            bcrypt.compare(password, hashed_password, function(err, result) {
                if (err) {
                    next(err)
                }

                if (result == true) {
                    // Passwords match, login is successful
                    res.send('Login successful! Welcome, ' + username + '!');
                    // Save user session here, when login is successful
                    req.session.userId = req.body.username;
                    return res.redirect('main/index')

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

router.post('/registered', 
    [check('username').notEmpty().withMessage('Username is required').isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters')]
    [check('email').isEmail()], 
    [check('password').isLength({min:8}).withMessage('Password must be at least 8 characters long')], 
    [check('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')],
    function (req, res, next) {
    req.sanitize(req.body.username)
    req.sanitize(req.body.email)
    req.sanitize(req.body.password)
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.redirect('./register'); }
        else { 
            // Extracting user data
            const plainPassword = req.body.password;
            const username = req.body.user; 
            const email = req.body.email;

            // Hashing the password
            bcrypt.hash(plainPassword, saltRounds, function (err, hashed_password) {
                if (err) {
                    next(err);
                }
                let sqlquery = "INSERT INTO users (username, email, hashed_password) VALUES (?,?,?)";

        
        // console.log('User Data:', {
        //     username: username,
        //     email: email,
        //     hashedPassword: hashedPassword
        // });

                let newUser = [username,email,hashed_password];
                db.query(sqlquery, newUser, (err,result) => {
                    if (err) {
                        next(err);
                    } else {
                    res.send(' Hello you are now registered with the username: ' + username +  'We will send an email to you at ' + req.body.email);
                    }
                });
            });
        }
});

// // Route to display the list of users 
// router.get('/users/userlist', function (req, res, next) {
//     // SQL query to fetch user details excluding hashed passwords
//     const sql = "SELECT username, email FROM users"

//     // Execute the query
//     db.query(sql, (err, results) => {
//         if (err) {
//             next(err)
//         }

//         // Render the users list page with the fetched data
//         res.render('userlist.ejs', { users: results });
//     });
// });

// // Define the /list route
// router.get('/userslist', redirectLogin, function (req, res) {
//     let sql = 'SELECT username, email FROM users';

//     db.query(sqlquery, (err, results) => {
//         if (err) {
//             throw err
//         }

//         res.render('userslist.ejs', { userslist,result});
//     });
// });

// Export the router object so index.js can access it
module.exports = router;