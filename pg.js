const pg = require('pg'); 
const { Client } = pg
 
const client = new Client({
  user: 'postgres',
  host: '37.27.31.109',
  database: 'postgres',
  password: '1234',
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
 