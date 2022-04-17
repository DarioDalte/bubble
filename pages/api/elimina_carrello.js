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
    var id = mongoose.Types.ObjectId(data.prodotto["_id"]);

    var product = await db.collection("products").findOne({ _id: id }); //Selects documents from collection product
    var cart = await db.collection("cart").findOne({ email: data.email }); //Selects documents from collection product
    var prezzo_prodotto = product["price"];
    var prova = [];
    var image = data.prodotto["image"];
    var a = 0;
    if (product) {
      for (var x = 0; x < cart["products"].length; x++) {
        if (cart["products"][x]["id"] == data.prodotto["_id"]) {
          for (var i = 0; i < product["varianti"]["colors"].length; i++) {
            if (
              product["varianti"]["colors"][i]["name"] == data.prodotto["color"]
            ) {
              for (var i = 0; i < product["varianti"]["RAM"].length; i++) {
                if (
                  product["varianti"]["RAM"][i]["gb"] == data.prodotto["RAM"]
                ) {
                  for (var i = 0; i < product["varianti"]["SSD"].length; i++) {
                    if (
                      product["varianti"]["SSD"][i]["size"] ==
                      data.prodotto["SSD"]
                    ) {
                      cart["products"].splice(x, 1);
                      x--;
                      var myquery = { email: data.email };
                      var newvalues = { $set: { products: cart["products"] } };
                      await db.collection("cart").updateOne(myquery, newvalues);
                      res.json({
                        prodotto: "eliminato",
                      });
                      a = 1;
                      return;
                    }
                  }
                }
              }
            }
          }
          await db.collection("cart").updateOne(myquery, newvalues);
          res.json({
            prodotto: "Inf",
          });
          a = 1;
          return;
          /* cart["products"].splice(x, 1);
          x--;
          var myquery = { email: data.email };
          var newvalues = { $set: { products: cart["products"] } };
          await db.collection("cart").updateOne(myquery, newvalues);
          res.json({
            prodotto: "eliminato",
          });
          a = 1;
          return;*/
        }
      }
      if (a == 0) {
        res.json({
          message: "Prodotto non presente",
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
