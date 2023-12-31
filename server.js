require('dotenv').config()
const express = require("express");
const cors = require("cors");
const app = express(); // fac app noua
const port = 3001;
const { start } = require("./db");
app.use(express.json());

app.use(cors());


//STRIPE 

const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)

app.post("/create-checkout-session", async (req,res)=>{
  //send the Stripe session to the client
  try{
    const uid = req.body.uid
    //CREAM SESIUNEA STRIPE
    const session = await stripe.checkout.sessions.create({
      //Modificam sesiunea dupa ce ne trebuie noua 
      payment_method_types:['card'],
      mode:'payment',
      line_items:req.body.items.map(item =>{
        // const storeItem = storeItems.get(item.id)
        return{
          price_data:{
            currency:"usd",
            product_data:{
              name: item.name
            },
            unit_amount: item.price * 100
          },
          quantity: item.quantity
        }
      }),
      success_url: `${process.env.SERVER_URL}`,
      cancel_url: `${process.env.SERVER_URL_CANCEL}`
    })

     
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  } 
})

//STRIPE CLI / WEBHOOK

const endpointSecret = process.env.ENDPOINT_SECRET

// Use body-parser to retrieve the raw body as a buffer


/*
app.post('/webhook', (request, response) => {
  const payload = request.body;
  const sig = request.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(raw, sig, endpointSecret);
    console.log(event)
  } catch (err) {
    console.log(err)
  }

  response.status(200).end();
});


app.post('/webhook', express.json({type: 'application/json'}), (req, res) => {

  // Get an event object
  const event = req.body;
  
  console.log(event)
  // Use its type to find out what happened
  if (event.type == 'payment_intent.payment_failed') {

    // Get the object affected
    const paymentIntent = event.data.object;


    // Use stored information to get an error object
    const error = paymentIntent.error;

    // Use its type to choose a res
    switch (error.type) {
      case 'StripeCardError':
        console.log(`A payment error occurred: ${error.message}`);
        break;
      case 'StripeInvalidRequestError':
        console.log('An invalid req occurred.');
        if (error.param) {
          console.log(`The parameter ${error.param} is invalid or missing.`);
        }
        break;
      default:
        console.log('Another problem occurred, maybe unrelated to Stripe.');
        break;
    }
  }
  res.send();
});
*/




//PRODUCTS
app.get("/data", async (req, res) => {
  try {
    const sqlInstance = await start();
    const result = await sqlInstance.query("SELECT * FROM Products");
    let recordset = result.recordset;

    res.send(recordset);
    // Send the recordset as a JSON response
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

 
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
app.get("/admin/:uid", async (req, res)=>{
  try{
    const uid = req.params.uid;
    const sqlInstance = await start();
    //de facut sproc
    const result = await sqlInstance.query(`SELECT is_admin from admins where admin_uid='${uid}'  `  );
    res.send(result.recordset)
    console.log(result.recordset)

  }catch(err){console.log(err)}
})


//FORMULAR 

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

