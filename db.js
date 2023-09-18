const sql = require("mssql");
require("dotenv").config();

const sqlConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  server: process.env.DB_SERVER,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustServerCertificate: true, // change to true for local dev / self-signed certs
  },
};

const start = async () => {
  try {
    // make sure that any items are correctly URL encoded in the connection string
    await sql.connect(sqlConfig);
    return sql;
    // //QUERY DE INSERT PRODUCTS
    // for (let i = 0; i < data.length; i++) {
    //   let y = data[i];
    //   let queryInsert = `INSERT Products (marca, name, pret, src) SELECT '${y.marca}', '${y.name}', '${y.pret}', '${y.src}'`;
    //   const result = await sql.query(queryInsert);
    //   console.dir(result);
    //}
  } catch (err) {
    console.log(err);
  }
};

start();

//export in NODE JS
module.exports = { start };
