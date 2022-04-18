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
    var wishlist = await db
      .collection("wishlist")
      .findOne({ email: data.email, name: data.name }); //Selects documents from collection product
    var prova = [];
    var image = data.prodotto["image"];
    var a = 0;
    if (product) {
      for (var i = 0; i < wishlist["products"].length; i++) {
        if (wishlist["products"][i]["id"] == data.prodotto["_id"]) {
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

        yourId = mongoose.Types.ObjectId(product["category"]);

        var category = await db
          .collection("categories")
          .find({ _id: yourId })
          .toArray();
        //Selects documents from collection products
        //Selects documents from collection products

        var obj_front_end = {
          id: product["_id"],
          brand: brand[0]["name"],
          name: product["name"],
          category: category[0]["category"],
          pollici: product["pollici"],
          processore: product["processore"],
          color: product["varianti"]["colors"][0]["name"],
          RAM: product["varianti"]["RAM"][0]["gb"],
          SSD: product["varianti"]["SSD"][0]["size"],
          price: product["price"],
          //image: product["image"],
        };

        var obj_database = {
          id: product["_id"],
          brand: brand[0]["name"],
          name: product["name"],
          category: category[0]["category"],
          pollici: product["pollici"],
          processore: product["processore"],
          color: product["varianti"]["colors"][0]["color_Id"],
          RAM: product["varianti"]["RAM"][0]["RAM_Id"],
          SSD: product["varianti"]["SSD"][0]["SSD_Id"],
          price: product["price"],
          //image: product["image"],
        };
        wishlist["products"].push(obj_database);
        var myquery = { email: data.email };
        var newvalues = { $set: { products: wishlist["products"] } };
        await db.collection("wishlist").updateOne(myquery, newvalues);
        res.json({
          prodotto: obj_front_end,
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
