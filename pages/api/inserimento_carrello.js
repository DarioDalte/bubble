import { DateRange } from "@material-ui/icons";
import { ObjectId } from "mongodb";
import { hashPassowrd, verifyPassword } from "./middlewares/auth.js";
const databaseConnection = require("./middlewares/database.js");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const mongoose = require("mongoose");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Calls the function databaseConnection

  try {
    var data = req.body; //Inserts the request data into the variable data

    await client.connect(); //Connect to our cluster
    const db = client.db(); //Inserts db into the variable db

    var cart = await db.collection("cart").findOne({ email: data.email }); //Selects documents from collection product
    var prova = [];

    var entra = [];
    var array = [];
    if (data.variant) {
      Object.keys(cart.products).map((product, index) => {
        Object.keys(cart.products[product]).map((key, index) => {
          console.log("11111111111111111111111111111111");
          console.log(key);
          console.log(String(cart.products[product][key]));
          console.log(String(mongoose.Types.ObjectId(data.id)));
          if (
            String(cart.products[product][key]) ==
            String(mongoose.Types.ObjectId(data.id))
          ) {
            console.log("cciao");
            Object.keys(cart.products[product][key]).map((key_1, index) => {
              console.log("2222222222222222222222222222222");
              console.log(cart.products[product][key][key_1]);
              console.log(mongoose.Types.ObjectId(data.variant[key_1]));
              if (
                String(cart.products[product][key][key_1]) ==
                String(mongoose.Types.ObjectId(data.variant[key_1]))
              ) {
                array.push(1);
              }
            });
          }
        });
      });
    } else {
      entra.push(1);
      Object.keys(cart.products).map((key, index) => {
        if (cart.products[key]["id"] == data.id) {
          entra.push(1);
        }
      });
    }

    if (entra.length == 2) {
      res.json({ message: "Incrementato" });
      return;
    } else if (entra.length == 1) {
      res.json({ message: "Aggiunto un nuovo prodotto" });
      return;
    } else if (array.length == 3) {
      res.json({ message: "Incrementato" });
      return;
    } else {
      res.json({ message: "Aggiunto un nuovo prodotto" });
      return;
    }
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
