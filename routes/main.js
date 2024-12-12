// Create a new router
const express = require("express")
const router = express.Router()
const cors = require('cors')
const app = express();

const db = require('../db');

// app.use(cors());
// app.use(express.json());

// Attach the database pool to the global object
// global.db = db;

// Handle our routes
router.get('/',function(req, res, next){
    
    try {
        const shopData = { shopName: "Spendaholic" }; // Define shopData
        const message = req.session.userId ? 'Welcome Back!' : null; // Check if the user is logged in
        res.render('index', { shopData, message }); // Pass both shopData and message
    } catch (error) {
        console.error('Error rendering index.ejs:', error.message);
        next(error);
    }

    // res.render('index.ejs')
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
    // const message = req.session.userId ? 'Welcome Back!' : null;

    // // Clear the message for logged-out users
    // if (!req.session.userId) {
    //     req.session.message = null;
    // }

    // // Define shop data
    // const shopData = { shopName: 'Spendaholic' };

    // // Render the index page with the message and shop data
    // res.render('index', { message, shopData });


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

// router.get('/search_result', function (req, res, next) {
//     // Search the database
//     let sqlquery = "SELECT * FROM items WHERE name LIKE '%" + req.query.search_text + "%'" 
//     // execute sql query
//     db.query(sqlquery, [`%${req.query.search_text}%`], (err, result) => {
//         if (err) {
//             next(err)
//         }
//         res.render("list.ejs", {availableitems:result})
//      }) 
// })


router.get('/search_result', async (req, res, next) => {
    // Check if the search_text parameter is provided
    if (!req.query.search_text) {
        console.log("No search text provided");
        return res.render("list.ejs", { availableitems: [], shopData: { shopName: "Spendaholic" } });
    }
    
    const searchText = `%${req.query.search_text}%`; // Wrap the search term with wildcards
    const sqlquery = "SELECT * FROM items WHERE name LIKE ?";
    try {
        console.log("Executing SQL Query:", sqlquery, searchText); // Debug log
        const [result] = await db.query(sqlquery, [searchText]); // Use parameterized query
        console.log("Query Result:", result); // Log the query result
        const shopData = { shopName: "Spendaholic" }; // Define shop data
        res.render("list.ejs", { availableitems: result, shopData }); // Pass results to list.ejs
    } catch (err) {
        console.error("Database Query Failed:", err.message); // Log error details
        next(err); // Pass error to the global error handler
    }
});



// router.get('/list', function(req, res, next) {
//     let sqlquery = "SELECT * FROM items" 
//     // execute sql query
//     db.query(sqlquery, (err, result) => {
//         if (err) {
//             console.error('Database Query Error:', err.message);
//             console.log("SQL Query:", sqlquery); // Log SQL query
//             return next(err);
//         }
//         console.log("Query Result:", result); // Log database response
//         res.render("list.ejs", { availableitems: result });
//     });
// })

router.get('/list', async (req, res, next) => {
    const sqlquery = "SELECT * FROM items";
    try {
        console.log("Executing SQL Query:", sqlquery); // Debug log
        const [result] = await db.query(sqlquery); // Use async/await for clarity
        console.log("Query Result:", result); // Log the query result
        const shopData = { shopName: "Spendaholic" }; // Define shop data
        res.render("list.ejs", { availableitems: result, shopData }); // Pass shopData and availableitems
    } catch (err) {
        console.error("Database Query Failed:", err.message); // Log error details
        next(err); // Pass error to the global error handler
    }
});


// Export the router object so index.js can access it
module.exports = router