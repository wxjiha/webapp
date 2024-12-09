// Create a new router
const express = require("express")
const router = express.Router()

// Handle our routes
router.get('/',function(req, res, next){
    res.render('index.ejs')
})

router.get('/home', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/loggedin'); // Redirect to login if not logged in
    }
    res.render('home.ejs', { username: req.session.userId });
});


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



// router.get('/users/userslist',function(req, res, next){
//     res.render("userslist.ejs")
// })

// router.get('/logout', redirectLogin, (req,res) => {
//     req.session.destroy(err => {
//     if (err) {
//       return res.redirect('./')
//     }
//     res.send('you are now logged out. <a href='+'./'+'>Home</a>');
//     })
// })


// Export the router object so index.js can access it
module.exports = router