// Create a new router
const express = require("express")
const router = express.Router()

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
})

router.get('/about',function(req, res, next){
    res.render('about.ejs')
})

router.get('/search',function(req, res, next){
    res.render("search.ejs")
})

router.get('/search_result', function (req, res, next) {
    // Search the database
    let sqlquery = "SELECT * FROM items WHERE name LIKE '%" + req.query.search_text + "%'" 
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableitems:result})
     }) 
})


router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM items" 
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableitems:result})
     })
})

// Route to handle login form submission
router.post('/users/login', function (req, res, next) {
    const { username, password } = req.body;

    db.query(
        'SELECT hashed_password FROM users WHERE username = ?',
        [username],
        (err, results) => {
            if (err) {
                console.error('Error querying database:', err);
                return res.status(500).send('An error occurred.');
            }

            if (results.length === 0) {
                return res.status(401).send('Invalid username or password.');
            }

            const hashedPassword = results[0].hashed_password;

            // Compare hashed password
            bcrypt.compare(password, hashedPassword, (err, match) => {
                if (err) {
                    console.error('Error comparing passwords:', err);
                    return res.status(500).send('An error occurred.');
                }

                if (match) {
                    res.send('Login successful! Welcome, ' + username + '!');
                } else {
                    res.status(401).send('Invalid username or password.');
                }
            });
        }
    );
});

// Export the router object so index.js can access it
module.exports = router