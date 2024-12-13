// Create a new router
const express = require("express")
const router = express.Router()
const cors = require('cors')
const app = express();
const axios = require('axios');
const db = require('../db');

// Handle our routes
router.get('/',function(req, res, next){
    
    try {
        const shopData = { shopName: "Shopaholic" }; // Define shopData
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
    res.render('about.ejs', {
        shopData: { shopName: "Shopaholic" }, // Adjust with actual shop data
        city: "London", // Default city
        weather: null, // Default weather data
        error: null // No error initially
    });
})

router.get('/search',function(req, res, next){
    res.render("search.ejs")
})


router.get('/search_result', async (req, res, next) => {
    // Check if the search_text parameter is provided
    if (!req.query.search_text) {
        console.log("No search text provided");
        return res.render("list.ejs", { availableitems: [], shopData: { shopName: "Shopaholic" } });
    }
    
    const searchText = `%${req.query.search_text}%`; // Wrap the search term with wildcards
    const sqlquery = "SELECT * FROM items WHERE name LIKE ?";
    try {
        console.log("Executing SQL Query:", sqlquery, searchText); // Debug log
        const [result] = await db.query(sqlquery, [searchText]); // Use parameterized query
        console.log("Query Result:", result); // Log the query result
        const shopData = { shopName: "Shopaholic" }; // Define shop data
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
        const shopData = { shopName: "Shopaholic" }; // Define shop data
        res.render("list.ejs", { availableitems: result, shopData }); // Pass shopData and availableitems
    } catch (err) {
        console.error("Database Query Failed:", err.message); // Log error details
        next(err); // Pass error to the global error handler
    }
});

// Route to fetch and display weather info using API
router.get('/weather', async (req, res, next) => {
    const apiKey = 'ff2514580f44e4ad36a047e37b98626c'; 
    const city = req.query.city || 'London'; 
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
        //Make request to OpenWeather API to get data
        const response = await axios.get(url);
        const weatherData = response.data;

        // Create a human-readable weather message
        const weatherMessage = `
            <h1>Weather in ${weatherData.name}</h1>
            <p>It is ${weatherData.main.temp}°C.</p>
            <p>The humidity is ${weatherData.main.humidity}%.</p>
            <p>The wind speed is ${weatherData.wind.speed} m/s.</p>
            <p>Weather condition: ${weatherData.weather[0].description}.</p>
        `;

        // Serve either HTML and EJS view
        if (req.query.format === 'html') {
            res.send(weatherMessage);
        } else {
            res.render('about.ejs', {
                weather: weatherData,
                city: city,
                error: null, 
            });
        }
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        if (error.response) {
            console.error("Response data:", error.response.data);
            console.error("Status code:", error.response.status);
        } else if (error.request) {
            console.error("No response received:", error.request);
        } else {
            console.error("Error setting up request:", error.message);
        }
        // Handle the error message as before
        const errorMsg = error.response && error.response.status === 404
            ? `City "${city}" not found. Please try a valid city name.`
            : `An error occurred while fetching weather data. Please try again later.`;
    
        res.render('about.ejs', {
            error: errorMsg,
            weather: null,
            city: city,
        });
    }
});    
// Export the router object so index.js can access it
module.exports = router