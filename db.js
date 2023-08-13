const sql = require("mssql");
const sqlConfig = {
  user: "test1",
  password: "1234",
  database: "TEST_DB",
  server: "LAPTOP-GFHOUTJ9\\SQLEXPRESS",
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

    //QUERY DE INSERT PRODUCTS
    // for (let i = 0; i < data.length; i++) {
    //   let y = data[i];
    //   // let queryInsert = `INSERT Products (marca, nume, pret) SELECT '${y.marca}', '${y.name}', ${y.pret}`;
    //   // const result = await sql.query(queryInsert);
    //   console.dir(result);
    // }
  } catch (err) {
    console.log(err);
  }
};

start();

//export in NODE JS
module.exports = { start };
