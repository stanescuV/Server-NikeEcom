/*
const sql = require("mssql");
require("dotenv").config();
const medii = ["prod", "dev"];
const mediu = process.argv?.[2] ? process.argv[2] : "dev"


let sqlConfig;


if((!medii.includes(mediu))){
throw new Error("No environnement, it has to be either dev or prod");
}

if(mediu == "dev"){ 
   sqlConfig = {
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
} else if (mediu == "prod"){
  
  sqlConfig = {
    
    user: process.env.DB_USER_PROD,
    password: process.env.DB_PASSWORD_PROD,
    database: process.env.DB_DATABASE_PROD,
    server: process.env.DB_SERVER_PROD,
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000,
    },
    options: {
      trustServerCertificate: true, // change to true for local dev / self-signed certs
    },
  };

}
  // no sql connection
  let sqlInstance = false;
  
  const start = async () => {
  //create new connection 
  if (!sqlInstance) {
    try {
      await sql.connect(sqlConfig);
      sqlInstance = sql;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
  return sqlInstance;
};

start();

//export in NODE JS
module.exports = { start };
*/