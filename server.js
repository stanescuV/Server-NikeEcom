//backend
//modificare
const express = require("express");
const cors = require("cors");
const app = express(); // fac app noua
const port = 3001;

const data = [
  //nike ********************************
  {
    key: 1,
    name: "1234",
    src: "/img/nike1.png",
    pret: "29",
  },
  {
    key: 2,
    name: "Nike 2",
    src: "/img/nike2.png",
    pret: "27",
  },
  {
    key: 3,
    name: "Nike 3",
    src: "/img/nike3.png",
    pret: "27",
  },
  {
    key: 4,
    name: "Nike 4",
    src: "/img/nike4.png",
    pret: "27",
  },
  {
    key: 5,
    name: "Nike 5",
    src: "/img/nike5.png",
    pret: "27",
  },
  {
    key: 6,
    name: "Nike 6",
    src: "/img/nike6.png",
    pret: "27",
  },

  //Ceremony **************************
  {
    key: 7,
    name: "Ceremony 1",
    src: "/img/ceremony1.png",
    pret: "27",
  },
  {
    key: 8,
    name: "Ceremony 2",
    src: "/img/ceremony2.png",
    pret: "27",
  },
  {
    key: 9,
    name: "Ceremony 3",
    src: "/img/ceremony3.png",
    pret: "27",
  },
  {
    key: 10,
    name: "Ceremony 4",
    src: "/img/ceremony4.png",
    pret: "27",
  },
  {
    key: 11,
    name: "Ceremony 5",
    src: "/img/ceremony5.png",
    pret: "27",
  },
  {
    key: 12,
    name: "Ceremony 6",
    src: "/img/ceremony1.png",
    pret: "27",
  },

  //Jordan ***************************

  {
    key: 13,
    name: "Jordan 1",
    src: "/img/jordan1.png",
    pret: "27",
  },
  {
    key: 14,
    name: "Jordan 2",
    src: "/img/jordan2.png",
    pret: "27",
  },
  {
    key: 15,
    name: "Jordan 3",
    src: "/img/jordan3.png",
    pret: "27",
  },
  {
    key: 16,
    name: "Jordan 4",
    src: "/img/jordan4.png",
    pret: "27",
  },
  {
    key: 17,
    name: "Jordan 5",
    src: "/img/jordan5.png",
    pret: "27",
  },
  {
    key: 18,
    name: "Jordan 6",
    src: "/img/jordan6.png",
    pret: "27",
  },
];

app.use(cors());

// API  =  application programming interface

app.get("/data", (req, res) => {
  res.json(data);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
