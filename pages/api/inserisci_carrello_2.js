import { ObjectId } from "mongodb";
import { parse } from "path";
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
    var array = [];
    var a = 0;
    //var product = await db.collection("products").findOne({ _id: id }); //Selects documents from collection product
    const cart = await db.collection("cart").findOne({ email: data.email }); //Selects documents from collection product

    var products = [];
    await Promise.all(
      cart.products.map(async (product, index) => {
        products.push(product);
        console.log(products);
        if (data.id == product["id"]) {
          console.log("si");
          if (data.variant) {
          } else {
            products[index].qnt =
              parseFloat(products[index].qnt) + parseFloat(data.qnt);
            console.log(products);

            var myquery = { email: data.email };

            var newvalues = { $set: { products: products } };
            db.collection("cart").updateOne(myquery, newvalues);

            res.json({
              message: "Modifiche",
            });
          }
        }
      })
    );
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}

/*




    var products = [];
    cart.products.map((product, index) => {
      products.push(product);
      console.log(products);
      if (data.id == product["id"]) {
        console.log("si");
        if (data.variant) {
        } else {
          products[index].qnt =
            parseFloat(products[index].qnt) + parseFloat(data.qnt);
          console.log(products);

          var myquery = { email: data.email };

          var newvalues = { $set: { products: products } };
          db.collection("cart").updateOne(myquery, newvalues);

          res.json({
            message: "Modifiche",
          });
        }
      }
    });
















    if (product.varianti) {
      Object.keys(cart.products).map(async (key_1, index) => {
        if (String(cart.products[key_1]["id"]) == String(id)) {
          Object.keys(product.varianti).map(async (key, index) => {
            for (var i = 0; i < product.varianti[key].length; i++) {
              console.log("IIIIIIIIIIIIIII " + i);
              Object.keys(data.varianti).map(async (key_2, index) => {
                console.log(product.varianti[key][i]);
                if (product.varianti[key][i]["id"] == data.varianti[key_2]) {
                  console.log("pusho");
                  array.push(1);
                }
              });
            }
          });
          if (array.length == 3) {
            Object.keys(cart.products).map(async (key, index) => {
              if (String(cart.products[key]["id"]) == String(id)) {
                cart.products[key]["qnt"] =
                  parseFloat(cart.products[key]["qnt"]) + 1;
                var myquery = { email: data.email };
                var newvalues = { $set: { products: cart.products } };
                console.log("SOno nel primo");
                db.collection("cart").updateOne(myquery, newvalues);
                res.json({
                  message: "Modifiche",
                });
                return;
              }
            });
          } else {
            var myquery = { email: data.email };
            var newvalues = { $set: { products: cart.products } };
            console.log("SOno nel secondo");
            db.collection("cart").updateOne(myquery, newvalues);
            res.json({
              message: "Aggiunto",
            });
            return;
          }
        }
      });
    } else {
      Object.keys(cart.products).map(async (key, index) => {
        if (String(cart.products[key]["id"]) == String(id)) {
          cart.products[key]["qnt"] = parseFloat(cart.products[key]["qnt"]) + 1;
          var myquery = { email: data.email };
          var newvalues = { $set: { products: cart.products } };
          console.log("SOno nel terzo");
          db.collection("cart").updateOne(myquery, newvalues);
          res.json({
            message: "Modifiche",
          });
          return;
        }
      });
      delete data.email;
      var prova = cart.products;
      console.log(prova);
      prova.push(data);
      console.log(prova);
      var myquery = { email: data.email };
      console.log("SOno nel quarto");
      var newvalues = { $set: { products: prova } };
      await db.collection("cart").updateOne(myquery, newvalues);
      res.json({
        prova: prova,
        message: "Aggiunto",
      });
      return;
    }
*/
/*
    var array = [];
    for (var i = 0; i < cart["products"].length; i++) {
      if (String(cart["products"][i]["id"]) == String(product["_id"])) {
        if (product["varianti"]) {
          for (var key in cart["product"]) {
            for (var x = 0; x < product["varianti"][key].length; x++) {
              if (product["varianti"][key][x]["id"] == data.varianti[key]) {
                console.log(product["varianti"][key][x]["id"]);
                console.log(data.varianti[key]);
                array.push(1);
              }
            }
          }

          if (array.length == 3) {
            cart["products"][i]["qnt"] =
              parseFloat(cart["products"][i]["qnt"]) + 1;
            console.log(cart["products"][i]["qnt"]);
            var myquery = { email: data.email };
            var newvalues = { $set: { products: cart["products"] } };
            await db.collection("cart").updateOne(myquery, newvalues);
            res.json({
              message: "Incrementato",
            });
            return;
          }
        } else {
          cart["qnt"] = parseFloat(cart["qnt"]) + 1;
          res.json({
            message: "neine",
          });
          return;
        }
      }
    }
    res.json({
      message: "nulla",
    });
    return;

*/
