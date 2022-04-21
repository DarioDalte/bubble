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

    var entra = [];
    var array = [];
    var funziaaaa;
    var pos;
    var a = 0;
    if (data.variant) {
      var non_funzia;
      var arr = [];
      console.log("HA VARIANTII");
      Object.keys(cart.products).map((product, index) => {
        console.log("PRODUCT: ");
        console.log(product);
        Object.keys(cart.products[product]).map((key, index) => {
          console.log("KEY: ");
          console.log(key);
          if (
            String(cart.products[product][key]) ==
            String(mongoose.Types.ObjectId(data.id))
          ) {
            console.log("IDENTICOO: ");
            console.log(String(cart.products[product][key]));
            console.log(String(mongoose.Types.ObjectId(data.id)));
            a = 1;
          }
          if (a == 1) {
            console.log("a = 1: ");
            console.log("KEY: ");
            console.log(key);
            Object.keys(cart.products[product][key]).map((key_1, index) => {
              if (
                String(cart.products[product][key][key_1]) ==
                String(mongoose.Types.ObjectId(data.variant[key_1]))
              ) {
                console.log("IDENTICOO: ");
                console.log(String(cart.products[product][key][key_1]));
                console.log(
                  String(mongoose.Types.ObjectId(data.variant[key_1]))
                );
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
          pos = key;
        }
      });
    }

    console.log("SONO FUORI");
    console.log("ARRAY");
    console.log(array);
    console.log("ENTRA");
    console.log(entra);

    var prova = [];
    if (entra.length == 2) {
      if (parseFloat(data.aumenta) == 0) {
        cart.products[pos]["qnt"] = parseFloat(cart.products[pos]["qnt"]) - 1;
        console.log(cart.products[pos]["qnt"]);
        prova = cart["products"];

        var myquery = { email: data.email };
        var newvalues = { $set: { products: prova } };
        console.log(prova);
        await db.collection("cart").updateOne(myquery, newvalues);
        res.json({
          prodotto: "decrementato",
        });
        return;
      } else {
        cart.products[pos]["qnt"] = parseFloat(cart.products[pos]["qnt"]) + 1;
        console.log(cart.products[pos]["qnt"]);
        prova = cart["products"];

        var myquery = { email: data.email };
        var newvalues = { $set: { products: prova } };
        console.log(prova);
        await db.collection("cart").updateOne(myquery, newvalues);
        res.json({
          prodotto: "incrementato",
        });
        return;
      }
    } else if (array.length == 3) {
      if (parseFloat(data.aumenta) == 0) {
        cart.products[funziaaaa]["qnt"] =
          parseFloat(cart.products[funziaaaa]["qnt"]) - 1;
        console.log(cart.products[funziaaaa]["qnt"]);
        prova = cart["products"];

        var myquery = { email: data.email };
        var newvalues = { $set: { products: prova } };
        console.log(prova);
        await db.collection("cart").updateOne(myquery, newvalues);
        res.json({
          prodotto: "decrementato",
        });
        return;
      } else {
        cart.products[funziaaaa]["qnt"] =
          parseFloat(cart.products[funziaaaa]["qnt"]) + 1;
        console.log(cart.products[funziaaaa]["qnt"]);
        prova = cart["products"];

        var myquery = { email: data.email };
        var newvalues = { $set: { products: prova } };
        console.log(prova);
        await db.collection("cart").updateOne(myquery, newvalues);
        res.json({
          prodotto: "incrementato",
        });
        return;
      }
    }
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}

/*

                  if (parseFloat(data.aumenta) == 0) {
                        cart["products"][x]["quantity"] =
                          parseFloat(cart["products"][x]["quantity"]) - 1;
                        console.log(cart["products"][x]["quantity"]);
                        prova = cart["products"];

                        var myquery = { email: data.email };
                        var newvalues = { $set: { products: prova } };
                        await db
                          .collection("cart")
                          .updateOne(myquery, newvalues);
                        res.json({
                          prodotto: "decrementato",
                        });
                        return;
                      } else {
                        cart["products"][x]["quantity"] =
                          parseFloat(cart["products"][x]["quantity"]) + 1;
                        console.log(cart["products"][x]["quantity"]);
                        prova = cart["products"];

                        var myquery = { email: data.email };
                        var newvalues = { $set: { products: prova } };
                        await db
                          .collection("cart")
                          .updateOne(myquery, newvalues);
                        res.json({
                          prodotto: "incrementato",
                        });
                        return;
                      }
                      
                      */
