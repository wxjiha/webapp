// Create a new router
const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const { check, validationResult } = require('express-validator');

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

// Route to handle login validation
// router.post('/loggedin',
//     [check('username').notEmpty().withMessage('Username is required')],
//     [check('password').notEmpty().withMessage('Password is required')],
//     async function (req, res, next) {
//     // req.sanitize(req.body.username)
//     // req.sanitize(req.body.plainPassword)
//     const errors = validationResult(req);
//     if (!errors.isEmpty()){
//         return res.status(400).json({errors:errors.array()});
//     }
//     const { username, password } = req.body;

//     // Query the database to find the user by username
//     db.query(
//         'SELECT hashed_password FROM users WHERE username = ?',
//         [username],
//         (err, results) => {
//             if (err) {
//                 next(err)
//             }

//             if (results.length === 0) {
//                 // No user found with the given username
//                 return res.status(400).send('Login failed: Invalid username or password.');
//             }

//             // Compare the entered password with the hashed password from the database
//             const hashed_password = results[0].hashed_password;


//             req.session.user = {
//                 id: results[0].id,
//                 username: results[0].username,
//             };

//             bcrypt.compare(password, hashed_password, function(err, result) {
//                 if (err) {
//                     next(err)
//                 }

//                 if (result == true) {
//                     // Passwords match, login is successful
//                     // res.send('Login successful! Welcome, ' + username + '!');
//                     // Save user session here, when login is successful
//                     req.session.userId = username;
//                     req.session.isLoggedIn = true;
//                     req.session.message = 'Welcome Back!';
//                     return res.redirect('/')

//                 } else {
//                     // Passwords do not match
//                     res.status(400).send('Login failed: Invalid username or password.');
//                 }
//             });
//         }
//     );
// });

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

router.post('/registered', 
    [check('username').notEmpty().withMessage('Username is required').isLength({ min: 3, max: 20 }).withMessage('Username must be between 3 and 20 characters').trim().escape()],
    [check('email').isEmail().withMessage('Invalid email address').normalizeEmail()], 
    [check('password').isLength({min:8}).withMessage('Password must be at least 8 characters long')], 
    [check('confirmPassword').custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')],
    function (req, res, next) {
    // req.sanitize(req.body.username)
    // req.sanitize(req.body.email)
    // req.sanitize(req.body.plainPassword)
    const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
            // res.redirect('./register');
        // }else { 
        //     // Extracting user data
        //     const plainPassword = req.body.password;
        //     const username = req.body.user; 
        //     const email = req.body.email;


            // Hashing the password
        bcrypt.hash(plainPassword, saltRounds, function (err, hashed_password) {
            if (err) {
                next(err);
            }
            let sqlquery = "INSERT INTO users (username, email, hashed_password) VALUES (?,?,?)";

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
);

//// // Route to display the list of users 
//// router.get('/users/userlist', function (req, res, next) {
////     // SQL query to fetch user details excluding hashed passwords
//  //   const sql = "SELECT username, email FROM users"

//    // // Execute the query
//    // db.query(sql, (err, results) => {
//      //   if (err) {
//        //     next(err)
//       //  }
//
////         // Render the users list page with the fetched data
//  //       res.render('userlist.ejs', { users: results });
//    // });
//// });

// //// Define the /list route
// //router.get('/userslist', redirectLogin, function (req, res) {
//   //  let sql = 'SELECT username, email FROM users';

//  //   db.query(sqlquery, (err, results) => {
//    //     if (err) {
//      //       throw err
//        // }

//      //   res.render('userslist.ejs', { userslist,result});
//    // });
//// });


router.get('/:id', (req, res) => {
    const userId = req.params.id;
    // Replace this with database logic
    const user = { id: userId, username: 'User1' };
    res.json(user);
});


// Export the router object so index.js can access it
module.exports = router;
module.exports.redirectLogin = redirectLogin;