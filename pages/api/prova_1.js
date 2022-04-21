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
    console.log("\n");
    console.log("\n");
    console.log("\n");

    var cart = await db.collection("cart").findOne({ email: data.email }); //Selects documents from collection product
    var a = 0;
    var entra = [];
    var array = [];
    if (data.variant) {
      console.log("HA VARIANTII");
      await Promise.all(
        Object.keys(cart.products).map(async (product, index) => {
          console.log("PRODUCT: ");
          console.log(product);
          await Promise.all(
            Object.keys(cart.products[product]).map(async (key, index) => {
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
                await Promise.all(
                  Object.keys(cart.products[product][key]).map(
                    async (key_1, index) => {
                      if (
                        String(cart.products[product][key][key_1]) ==
                        String(mongoose.Types.ObjectId(data.variant[key_1]))
                      ) {
                        console.log("IDENTICOO: ");
                        console.log(String(cart.products[product][key][key_1]));
                        console.log(
                          String(mongoose.Types.ObjectId(data.variant[key_1]))
                        );
                        array.push(1);
                        if (array.length == 3) {
                          cart.products[product]["qnt"] =
                            parseFloat(cart.products[product]["qnt"]) + 1;
                          console.log(cart.products);
                          var myquery = { email: data.email };
                          var newvalues = { $set: { products: cart.products } };
                          await db
                            .collection("cart")
                            .updateOne(myquery, newvalues);
                          res.json({ message: "Incrementato" });
                          a = 1;
                        }
                      }
                    }
                  )
                );
              }
            })
          );
          array = [];
        })
      );
      if (a == 0) {
        data.id = mongoose.Types.ObjectId(data.id);
        //delete data.email;
        cart.products.push(data);
        console.log(cart.products);
        var myquery = { email: data.email };
        var newvalues = { $set: { products: cart.products } };
        await db.collection("cart").updateOne(myquery, newvalues);
        a = 2;
      }
    } else {
      entra.push(1);
      await Promise.all(
        Object.keys(cart.products).map(async (key, index) => {
          if (cart.products[key]["id"] == data.id) {
            cart.products[product]["qnt"] =
              parseFloat(cart.products[product]["qnt"]) + 1;
            console.log(cart.products);
            var myquery = { email: data.email };
            var newvalues = { $set: { products: cart.products } };
            await db.collection("cart").updateOne(myquery, newvalues);
            a = 3;
          }
        })
      );
      if (a != 3) {
        data.id = mongoose.Types.ObjectId(data.id);
        //delete data.email;
        cart.products.push(data);
        console.log(cart.products);
        var myquery = { email: data.email };
        var newvalues = { $set: { products: cart.products } };
        await db.collection("cart").updateOne(myquery, newvalues);
        a = 4;
      }
    }

    if (a == 1) {
      res.json({ message: "Aggiunto un nuovo prodotto" });
    } else if (a == 2) {
      res.json({ message: "Incremento" });
    } else if (a == 3) {
      res.json({ message: "Aggiunto un nuovo prodotto" });
    } else {
      res.json({ message: "Incremento" });
    }
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
