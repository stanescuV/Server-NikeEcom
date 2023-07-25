const sql = require("mssql");
const sqlConfig = {
  user: "test1",
  password: "1234",
  database: "test 1234",
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
    const result = await sql.query`select 2`;
    console.dir(result);
  } catch (err) {
    console.log(err);
  }
};

start();
