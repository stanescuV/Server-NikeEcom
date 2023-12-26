//backend
//modificare
require('dotenv').config()
const express = require("express");
const cors = require("cors");
const app = express(); // fac app noua
const port = 3001;
const { start } = require("./db");

app.use(express.json());

app.use(cors());
/*

//STRIPE 
app.use(express.json())
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY)
//Exemplu de map cu pret, nume si id 
const storeItems = new Map([[1, {priceInCents:30000, name:"nike jordan 1"}],[2, {priceInCents:10000, name:"ceremony 1"}]])
/*pretul trebuie mereu sa fie ori pe Server / DB / fisier JSON niciodata pe Client*/ 

// app.post("/create-checkout-session", async (req,res)=>{
//   try{
//     //CREAM SESIUNEA STRIPE
//     const session = await stripe.checkout.sessions.create({
//       //Modificam sesiunea dupa ce ne trebuie noua 
//       payment_method_types:['card'],
//       mode:'payment',
//       line_items:req.body.items.map(item =>{
//         const storeItem = storeItems.get(item.id)
//         return{
//           price_data:{
//             currency:"usd",
//             product_data:{
//               name: storeItem.name
//             },
//             unit_amount: storeItem.priceInCents
//           },
//           quantity: item.quantity
//         }
//       }) ,
//       success_url: `${process.env.SERVER_URL}`,
//       cancel_url: `${process.env.SERVER_URL_CANCEL}`

//     })
//     res.json({ url: session.url })
//   } catch (e) {
//     res.status(500).json({ error: e.message })
//   }
// })
// app.listen(3002, ()=> console.log("listening on port 3002"))

//end stripe 

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
    console.log(req.params)
    const orderID = req.params.orderID
    const sqlInstance = await start();
    const result = await sqlInstance.query(`select [name], price, qt from detailed_order where orderID=${orderID}`  );
    res.send(result.recordset)
    
  } catch(err){
    console.log(err);
  }
})




//FORMULAR 

app.post("/comanda", async (req, res) => {

  try{
    let form = req.body.form;
    let itemsQuery = JSON.stringify(req.body.items);
    let uid = req.body.uid

    const sqlInstance = await start();
    const result1 = await sqlInstance.query(`
    Exec Insert_Clienti @ClientEmail='${form.email}', @Country='${form.country}', @Region='${form.region}',@Street='${form.street}',@Birth='${form.birth}',@Phone='${form.tel}'
    `);
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

