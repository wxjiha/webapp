// Create a new router
const express = require("express")
const router = express.Router()
const cors = require('cors')
const app = express();

app.use(cors());
app.use(express.json());

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
    // if (req.session.isLoggedIn) {
    //     res.render('index', { message: 'Welcome!' });
    // } else {
    //     res.render('index', { message: null });
    // }

    // const message = req.session.isLoggedIn ? 'Welcome Back!' : null; // Check login status
    // res.render('index', { message });
    // if (!req.session.userId) {
    //     req.session.message = null; // Clear the message for logged-out users
    // }
    // const message = req.session.message || null;
    // const shopData = { shopName: 'Your Shop' };

    // res.render('index', { message, shopData });

    // Check if the user is logged in and set the message accordingly
    const message = req.session.userId ? 'Welcome Back!' : null;

    // Clear the message for logged-out users
    if (!req.session.userId) {
        req.session.message = null;
    }

    // Define shop data
    const shopData = { shopName: 'Spendaholic' };

    // Render the index page with the message and shop data
    res.render('index', { message, shopData });


})

router.get('/checkout',function(req, res, next){
    res.render('checkout.ejs')
})

// router.get('/home', (req, res) => {
//     if (!req.session.userId) {
//         return res.redirect('/loggedin'); // Redirect to login if not logged in
//     }
//     res.render('home.ejs', { username: req.session.userId });
// });


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



// Export the router object so index.js can access it
module.exports = router