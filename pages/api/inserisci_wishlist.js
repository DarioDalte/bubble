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
    console.log(product);
    var wishlist = await db
      .collection("wishlist")
      .findOne({ email: data.email, name: data.name }); //Selects documents from collection product
    var prova = [];
    var a = 0;

    for (var i = 0; i < wishlist["products"].length; i++) {
      console.log(wishlist["products"][i]);
      if (String(wishlist["products"][i]) == String(id)) {
        a = 1;
        res.json({
          message: "prodotto gia presente nella wishlist",
        });
        return;
      }
    }

    if (a == 0) {
      let yourId = mongoose.Types.ObjectId(product["brand"]);
      var brand = await db
        .collection("companies")
        .find({ _id: yourId })
        .toArray();
      //Selects documents from collection products
      //Selects documents from collection products

      //Selects documents from collection products

      var obj_front_end = {
        id: mongoose.Types.ObjectId(data.id),
        brand: brand[0]["name"],
        name: product["name"],

        price: product.price,
        image: product["image"],
      };
      wishlist["products"].push(product["_id"]);
      var myquery = { email: data.email };
      var newvalues = { $set: { products: wishlist["products"] } };
      await db.collection("wishlist").updateOne(myquery, newvalues);
      res.json({
        prodotto: obj_front_end,
      });
      return;
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
