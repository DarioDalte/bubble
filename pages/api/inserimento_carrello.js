import { DateRange } from "@material-ui/icons";
import { produceWithPatches } from "immer";
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
    console.log("\n");
    console.log("\n");
    console.log("\n");

    var cart = await db.collection("cart").findOne({ email: data.email }); //Selects documents from collection product
    var a = 0;
    var entra = [];
    var array = [];
    var funziaaaa;
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
        }
      });
    }

    console.log("SONO FUORI");
    console.log("ARRAY");
    console.log(array);
    console.log("ENTRA");
    console.log(entra);

    if (entra.length == 2) {
      await Promise.all(
        Object.keys(cart.products).map(async (product, index) => {
          if (cart.products[product]["id"] == data.id) {
            cart.products[product]["qnt"] =
              parseFloat(cart.products[product]["qnt"]) + 1;
            console.log(cart.products);
            var myquery = { email: data.email };
            var newvalues = { $set: { products: cart.products } };
            await db.collection("cart").updateOne(myquery, newvalues);
            res.json({ message: "Incrementato" });
            return;
          }
        })
      );
      entra = [];
    } else if (entra.length == 1) {
      var d = 0;

      await Promise.all(
        Object.keys(cart.products).map(async (product, index) => {
          if (d == 0) {
            data.id = mongoose.Types.ObjectId(data.id);
            d = 1;
            //delete data.email;
            cart.products.push(data);
            console.log(cart.products);
            var myquery = { email: data.email };
            var newvalues = { $set: { products: cart.products } };
            await db.collection("cart").updateOne(myquery, newvalues);
            d = 1;
          }
        })
      );
      entra = [];
      res.json({ message: "Aggiunto un nuovo prodotto" });
      return;
    } else if (array.length == 3) {
      cart.products[funziaaaa]["qnt"] =
        parseFloat(cart.products[funziaaaa]["qnt"]) + 1;
      console.log(cart.products);
      var myquery = { email: data.email };
      var newvalues = { $set: { products: cart.products } };
      await db.collection("cart").updateOne(myquery, newvalues);

      array = [];
      res.json({ message: "Incrementato" });
      return;
    } else {
      var d = 0;
      console.log("sonoqui");

      if (d == 0) {
        Object.keys(data.variant).map(async (key, index) => {
          data.id = mongoose.Types.ObjectId(data.id);
          data.variant[key] = mongoose.Types.ObjectId(data.variant[key]);
        });
        d = 1;
        //delete data.email;
        cart.products.push(data);
        console.log(cart.products);
        var myquery = { email: data.email };
        var newvalues = { $set: { products: cart.products } };
        await db.collection("cart").updateOne(myquery, newvalues);
      }
      array = [];
      res.json({ message: "Aggiunto un nuovo prodotto" });
      return;
    }
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
