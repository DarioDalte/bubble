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
    var id = mongoose.Types.ObjectId(data.id);

    var product = await db.collection("products").findOne({ _id: id }); //Selects documents from collection product
    var wishlist = await db
      .collection("wishlist")
      .findOne({ email: data.email, name: data.name }); //Selects documents from collection product
    var a = 0;
    if (product) {
      for (var i = 0; i < wishlist["products"].length; i++) {
        if (String(id) == String(wishlist["products"][i])) {
          wishlist["products"].splice(i, 1);
          i--;
          var myquery = { email: data.email };
          var newvalues = { $set: { products: wishlist["products"] } };
          await db.collection("wishlist").updateOne(myquery, newvalues);
          a = 1;
          res.json({
            prodotto: "eliminato",
          });
          return;
        }
      }
      if (a == 0) {
        res.json({
          prodotto: "id non corretto",
        });
        return;
      }
    } else {
      res.json({
        message: "Nessun prodotto",
      });
      return;
    }
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
