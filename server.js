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
    console.log(req.body)
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
      success_url: `${process.env.SERVER_URL}/${uid}`,
      cancel_url: `${process.env.SERVER_URL_CANCEL}`
    })

     
    res.json({ url: session.url })
  } catch (e) {
    res.status(500).json({ error: e.message })
  } 
})




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

