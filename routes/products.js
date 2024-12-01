const express = require("express")
const router = express.Router()

router.get('/search',function(req, res, next){
    res.render("search.ejs")
})

router.get('/search_result', function (req, res, next) {
    // Search the database
    let sqlquery = "SELECT * FROM items WHERE name LIKE '%" + req.query.search_text + "%'" // query database 
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableitems:result})
     }) 
})


router.get('/list', function(req, res, next) {
    let sqlquery = "SELECT * FROM items" // query database 
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            next(err)
        }
        res.render("list.ejs", {availableitems:result})
     })
})

router.get('/addproduct', function (req, res, next) {
    res.render('addproduct.ejs')
})

router.post('/productadded', function (req, res, next) {
    // saving data in database
    let sqlquery = "INSERT INTO items (name, price) VALUES (?,?)"
    // execute sql query
    let newrecord = [req.body.name, req.body.price]
    db.query(sqlquery, newrecord, (err, result) => {
        if (err) {
            next(err)
        }
        else
            res.send(' This product has been added to database, name: '+ req.body.name + ' price '+ req.body.price)
    })
}) 