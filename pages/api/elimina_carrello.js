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
    console.log(data.id);
    data.id = mongoose.Types.ObjectId(data.id);
    var user = await db.collection("cart").findOne({
      email: data.email,
    });

    var product = await db.collection("products").findOne({ _id: data.id }); //Selects documents from collection product
    var id = data.id;
    var prezzo_prodotto = product["price"];
    var image;
    if (product) {
      if (user["products"].length == 0) {
        console.log("sono dentro");
        for (var i = 0; i < product["varianti"]["colors"].length; i++) {
          if (product["varianti"]["colors"][i]["name"] == data.colore) {
            prezzo_prodotto =
              prezzo_prodotto +
              parseFloat(product["varianti"]["colors"][i]["increase"]);
            image = product["varianti"]["colors"][i]["image"];
          }
        }
        for (var i = 0; i < product["varianti"]["RAM"].length; i++) {
          if (product["varianti"]["RAM"][i]["gb"] == data.ram) {
            prezzo_prodotto =
              prezzo_prodotto +
              parseFloat(product["varianti"]["RAM"][i]["increase"]);
          }
        }
        for (var i = 0; i < product["varianti"]["SSD"].length; i++) {
          if (product["varianti"]["SSD"][i]["size"] == data.ram) {
            prezzo_prodotto =
              prezzo_prodotto +
              parseFloat(product["varianti"]["SSD"][i]["increase"]);
          }
        }
        let yourId = mongoose.Types.ObjectId(product["brand"]);
        var brand = await db
          .collection("companies")
          .find({ _id: yourId })
          .toArray();
        //Selects documents from collection products

        yourId = mongoose.Types.ObjectId(product["category"]);
        var category = await db
          .collection("categories")
          .find({ _id: yourId })
          .toArray();
        //Selects documents from collection products
        var obj = {
          id: product["_id"],
          brand: brand[0]["name"],
          name: product["name"],
          category: category[0]["category"],
          pollici: product["pollici"],
          processore: product["processore"],
          price: prezzo_prodotto,
          image: image,
          quantity: data.quantity,
        };

        user["products"].push(obj);
        var myquery = { email: data.email };
        var newvalues = { $set: { products: user["products"] } };
        //await db.collection("cart").updateOne(myquery, newvalues);

        res.json({
          prodotto: obj,
        });
      } else {
        for (var f = 0; f < user["products"].length; f++) {
          console.log(user["products"][f]);
        }
        /*console.log("sono dentro");
        for (var i = 0; i < product["varianti"]["colors"].length; i++) {
          if (product["varianti"]["colors"][i]["name"] == data.colore) {
            prezzo_prodotto =
              prezzo_prodotto +
              parseFloat(product["varianti"]["colors"][i]["increase"]);
            image = product["varianti"]["colors"][i]["image"];
          }
        }
        for (var i = 0; i < product["varianti"]["RAM"].length; i++) {
          if (product["varianti"]["RAM"][i]["gb"] == data.ram) {
            prezzo_prodotto =
              prezzo_prodotto +
              parseFloat(product["varianti"]["RAM"][i]["increase"]);
          }
        }
        for (var i = 0; i < product["varianti"]["SSD"].length; i++) {
          if (product["varianti"]["SSD"][i]["size"] == data.ram) {
            prezzo_prodotto =
              prezzo_prodotto +
              parseFloat(product["varianti"]["SSD"][i]["increase"]);
          }
        }
        let yourId = mongoose.Types.ObjectId(product["brand"]);
        var brand = await db
          .collection("companies")
          .find({ _id: yourId })
          .toArray();
        //Selects documents from collection products

        yourId = mongoose.Types.ObjectId(product["category"]);
        var category = await db
          .collection("categories")
          .find({ _id: yourId })
          .toArray();
        //Selects documents from collection products
        var obj = {
          id: product["_id"],
          brand: brand[0]["name"],
          name: product["name"],
          category: category[0]["category"],
          pollici: product["pollici"],
          processore: product["processore"],
          price: prezzo_prodotto,
          image: image,
          quantity: data.quantity,
        };

        user["products"].push(obj);
        var myquery = { email: data.email };
        var newvalues = { $set: { products: user["products"] } };
        //await db.collection("cart").updateOne(myquery, newvalues);
*/
        res.json({
          prodotto: obj,
        });
        res.json({
          message: "Non ce un cazzo",
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
