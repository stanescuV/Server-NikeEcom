//backend
//modificare
const express = require("express");
const cors = require("cors");
const app = express(); // fac app noua
const port = 3001;
const { start } = require("./db");

app.use(cors());

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

// API  =  application programming interface

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
