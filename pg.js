const pg = require('pg'); 
require('dotenv').config();
const { Client } = pg
 
const client = new Client({
  user: process.env.PG_USER,
  host: process.env.PG_SERVER,
  database: process.env.PG_DB,
  password: process.env.PG_PASSWORD,
  port: 5432,
})

async function  connectionDB(){
    await client.connect()
    // const res = await client.query("select * from client")
    // console.log(res.rows[0]);


    return client
}


module.exports = {connectionDB};
// connectionDB();
 