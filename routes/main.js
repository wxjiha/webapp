// Create a new router
const express = require("express")
const router = express.Router()
const cors = require('cors')
const app = express();

const db = require('../db');

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

})

router.get('/checkout',function(req, res, next){
    res.render('checkout.ejs')
})


router.get('/about',function(req, res, next){
    res.render('about.ejs')
})

router.get('/search',function(req, res, next){
    res.render("search.ejs")
})


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