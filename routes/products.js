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
    console.log("Executing /list route"); 
    let sqlquery = "SELECT * FROM items" // query database 
    console.log("Executing SQL Query:", sqlquery);
    // execute sql query
    db.query(sqlquery, (err, result) => {
        if (err) {
            console.error("Database query failed:", err);
            next(err)
        }
        console.log("Query result:", result);
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


// Example: Fetch all products
router.get('/', (req, res) => {
    // Replace this with database logic
    const items = [
        { id: 1, name: 'Product 1', price: 1000 },
        { id: 2, name: 'Product 2', price: 2000 },
    ];
    res.json(items);
});

// Example: Fetch a single product by ID
router.get('/:id', (req, res) => {
    const productId = req.params.id;
    // Replace this with database logic
    const items = { id: itemId, name: 'Product 1', price: 1000 };
    res.json(items);
});

// Display all products
router.get('/products', async (req, res) => {
    try {
        const [products] = await db.query('SELECT * FROM items');
        res.render('products', { products });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).send('Failed to load products.');
    }
});

// // Add product to basket
// router.post('/add-to-basket', (req, res) => {
//     const { productId, quantity } = req.body;

//     // Initialize basket in session if it doesn't exist
//     if (!req.session.basket) {
//         req.session.basket = [];
//     }    

//     // Check if product already in basket, and update quantity
//     const existingProductIndex = req.session.basket.findIndex(item => item.productId === productId);

//     if (existingProductIndex !== -1) {
//         // If the product is already in the basket, update the quantity
//         req.session.basket[existingProductIndex].quantity += quantity;
//     } else {
//         // Add the new product to the basket
//         req.session.basket.push({ productId, quantity });
//     }

//     res.status(200).json({ message: 'Product added to basket successfully!' });

// });

// Add product to basket
router.post('/add-to-basket', async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || quantity <= 0) {
        return res.status(400).json({ message: 'Invalid product or quantity' });
    }

    try {
        // Fetch product details from the database
        const product = await db.query('SELECT * FROM products WHERE id = ?', [productId]);

        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const productDetails = product[0];

        // Initialize basket in session if it doesn't exist
        if (!req.session.basket) {
            req.session.basket = [];
        }

        // Check if product already in basket and update quantity
        const existingProductIndex = req.session.basket.findIndex(item => item.productId === productId);

        if (existingProductIndex !== -1) {
            req.session.basket[existingProductIndex].quantity += quantity;
        } else {
            req.session.basket.push({
                productId,
                name: product.name,
                price: product.price,
                quantity
            });
        }

        res.status(200).json({ message: 'Product added to basket successfully!' });
    } catch (err) {
        console.error('Error adding product to basket:', err);
        res.status(500).json({ message: 'Failed to add product to basket. Please try again.' });
    }
});



module.exports = router;
