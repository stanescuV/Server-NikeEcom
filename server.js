require('dotenv').config();

// Express and other required modules
const express = require("express");
const cors = require("cors");
const http = require("http");

// Database connection module (make sure this is correctly implemented)
const { connectionDB } = require("./pg");

// Initializing express application
const app = express();
app.use(cors()); // Enable CORS

async function connectionAndEndpoints(){
    let db;

    async function query (string=""){
        let result;
        try {
            result = (await db.query(string)).rows;
        } catch (err) {
            console.error('Database query error:', err);
            throw err;
        }
        return result;
    }

    try {
        db = await connectionDB();
        console.log('Database connected');
    } catch (err) {
        console.error('Database connection error:', err);
        return;
    }

    app.get("/data", async (req, res) => {
        try {
            const result = await query('SELECT * FROM products');
            res.send(result);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: "An error occurred while sending the product data" });
        }
    });

    const bodyParser = require("body-parser");
    app.post('/webhook', bodyParser.raw({type:"application/json"}), async (req, res) => {
        const endpointSecret = process.env.ENDPOINT_SECRET;
        const payload = req.body;
        const sig = req.headers['stripe-signature'];

        let event;
        try {
            event = stripe.webhooks.constructEvent(payload, sig, endpointSecret);
        } catch (err) {
            console.log(err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        console.log(event.data);
        res.status(200).end();
    });

    // Stripe integration
    app.use(express.json());
    const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);

    app.post("/create-checkout-session", async (req, res) => {
        try {
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                mode: 'payment',
                line_items: req.body.items.map(item => ({
                    price_data: {
                        currency: "usd",
                        product_data: { name: item.name },
                        unit_amount: item.price * 100
                    },
                    quantity: item.quantity
                })),
                success_url: `${process.env.SERVER_URL}`,
                cancel_url: `${process.env.SERVER_URL_CANCEL}`,
                shipping_address_collection: { allowed_countries: ['US', 'CA'] },
                billing_address_collection: 'required'
            });

            res.json({ url: session.url });
        } catch (e) {
            res.status(500).json({ error: e.message });
        }
    });
    /*
    
  
  
  
  
  //PRODUCTS
  app.get("/data", async (req, res) => {
    const searchedString = req.query.q; 
    if(!searchedString){
      try {
        //functie cu sqlInstance.query
        const sqlInstance = await start();
        //query to get info with select
        const result = await sqlInstance.query(`
        EXEC ProductsWithDiscounts
      `);
      let recordset = result.recordset;
        res.send(recordset);
        // Send the recordset as a JSON response
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      }
    } else {
      //for admin purpose 
      try {
        const sqlInstance = await start();
        const result = await sqlInstance.query(`SELECT TOP 5 [name], pret, id, current_price, src, marca FROM Products WHERE [name] LIKE '%${searchedString}%'` );
        let recordset = result.recordset;
        
        res.send(recordset);
        // Send the recordset as a JSON response
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "An error occurred" });
      }
    }
      
  });
  
  
  
  
  //discount 
  
  app.post("/discount", async (req, res) => {
    
  
    try{
      const products = req.body.products;
      const { discount, dateStart, dateEnd, discountName } = req.body;
      console.log(req.body)
      const sqlInstance = await start();
      //first insert in the discounts
      const discountQuery = `Insert into discounts(discount_value, discount_name, date_start, date_end) 
      OUTPUT INSERTED.discount_id
      values(${Number(discount)}, '${discountName}', '${dateStart}', '${dateEnd}');`
      const result = await sqlInstance.query(discountQuery);
  
    
      // get the last discount_id
      const discountProductsQuery = `select max (discount_id) as id from discounts `
      const result2= await sqlInstance.query(discountProductsQuery);
      let discountID = result2.recordset[0].id;
  
      //insert all the products with the last discount id
      for(let product of products){
        let insertDP = `Insert into discount_products (discount_id, product_id) values (${discountID}, ${product.id})`
        let result3 = await sqlInstance.query(insertDP);
      }
      
      res.send(result.recordset)
     
    } catch(err){
      console.log(err)
    }
  })
  
  //list of products for admin
  app.get("/products-discounts", async(req,res)=>{
    try{
      const sqlInstance = await start();
      const result = await sqlInstance.query(`select [name], marca, id from products`);
      console.log(result.recordset);
      res.send(result.recordset);
    } catch(err){
      console.log(err)
      res.status(500).json({ error: "An error occurred /products-discount" });
    }
  })
   
  //gets orders
  app.get("/orders/:uid", async (req, res) => {
    try{
      const uid = req.params.uid;
      const sqlInstance = await start();
      const result = await sqlInstance.query(`SELECT orderID, order_date, total from orders where order_uid ='${uid}' `  );
      res.send(result.recordset)
    } catch(err){
      console.log(err);
    }
  })
  //gets detailed orders
  app.get("/orders/:uid/:orderID", async(req, res)=> {
    try{
      const orderID = req.params.orderID
      const sqlInstance = await start();
      //de facut sproc
      const result = await sqlInstance.query(`select [name], price, qt from detailed_order where orderID=${orderID}`  );
      res.send(result.recordset)
      
    } catch(err){
      console.log(err);
    }
  })
  
  //ADMIN
  app.post("/admin", async (req, res)=>{
    try{
      const uid = req.body.uid;
      const sqlInstance = await start();
      // sproc to do
      const result = await sqlInstance.query(`SELECT is_admin from admins where admin_uid='${uid}'`);
      res.send(result.recordset)
    }catch(err){
      console.log(err)
      res.statusCode(500);
    }
  })
  
  // Modify current price
  
  app.post("/price-db", async(req, res)=>{
    const [itemID, itemPrice]= [req.body.itemID, req.body.itemPrice];
    console.log(req.body)
    const sqlInstance = await start();
    const result = await sqlInstance.query(`UPDATE Products
    SET pret = ${itemPrice}
    WHERE id = ${itemID} 
      
      `)
  })
  
  
  app.post("/success-order/:uid", async (req, res) => {
  
    try{
      let itemsQuery = JSON.stringify(req.body.items);
      let uid = req.body.uid
  
      const sqlInstance = await start();
      const result2 = await sqlInstance.query(`
      Exec Insert_Orders @order='${itemsQuery}',@uid='${uid}'
  `);
     
  
    } catch (err){
      console.log(err)
    }
  
  } )
  // API  =  application programming interface
  
  */ 
  }
  
  // app.listen(port, () => {
  //   console.log(`Example app listening on port ${port}`);
  // });



  connectionAndEndpoints();

  const httpServer = http.createServer(app);
  httpServer.listen(3001, '0.0.0.0', () => {
      console.log('HTTP Server running on port 3001');
  });
