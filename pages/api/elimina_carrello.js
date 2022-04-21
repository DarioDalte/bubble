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

    var a = 0;
    var entra = [];
    var array = [];
    var funziaaaa;
    var pos;
    if (data.variant) {
      var non_funzia;
      var arr = [];
      Object.keys(cart.products).map((product, index) => {

        Object.keys(cart.products[product]).map((key, index) => {
  
          if (
            String(cart.products[product][key]) ==
            String(mongoose.Types.ObjectId(data.id))
          ) {
 
            a = 1;
          }
          if (a == 1) {

            Object.keys(cart.products[product][key]).map((key_1, index) => {
              if (
                String(cart.products[product][key][key_1]) ==
                String(mongoose.Types.ObjectId(data.variant[key_1]))
              ) {

                arr.push(1);
                non_funzia = product;
              }
            });
          }
        });
        if (arr.length == 3) {
          array = arr;
          funziaaaa = product;
        }
        arr = [];
      });
    } else {
      entra.push(1);
      Object.keys(cart.products).map((key, index) => {
        if (cart.products[key]["id"] == data.id) {
          entra.push(1);
          pos = index;
        }
      });
    }

    if (entra.length == 2) {
      cart["products"].splice(pos, 1);
      var myquery = { email: data.email };
      var newvalues = { $set: { products: cart["products"] } };
      await db.collection("cart").updateOne(myquery, newvalues);
      res.json({
        prodotto: "eliminato",
      });
      a = 1;
      return;
    }
    if (array.length == 3) {
      cart["products"].splice(funziaaaa, 1);
      var myquery = { email: data.email };
      var newvalues = { $set: { products: cart["products"] } };
      await db.collection("cart").updateOne(myquery, newvalues);
      res.json({
        prodotto: "eliminato",
      });
      a = 1;
      return;
    }
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
