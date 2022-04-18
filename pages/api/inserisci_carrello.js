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
        var id_colore, id_ram, id_ssd, nome_colore, nome_ram, nome_ssd;
        for (var i = 0; i < product["varianti"]["colors"].length; i++) {
          if (
            product["varianti"]["colors"][i]["name"] == data.prodotto["color"]
          ) {
            console.log(product["varianti"]["colors"][i]["name"]);
            console.log(data.prodotto["color"]);
            console.log("uguale");
            id_colore = product["varianti"]["colors"][i]["color_Id"];
            nome_colore = product["varianti"]["colors"][i]["name"];
            for (var y = 0; y < product["varianti"]["RAM"].length; y++) {
              if (product["varianti"]["RAM"][y]["gb"] == data.prodotto["RAM"]) {
                console.log(product["varianti"]["RAM"][y]["gb"]);
                console.log(data.prodotto["RAM"]);
                console.log("uguale");
                id_ram = product["varianti"]["RAM"][y]["RAM_Id"];
                nome_ram = product["varianti"]["RAM"][y]["gb"];
                for (var z = 0; z < product["varianti"]["SSD"].length; z++) {
                  if (
                    product["varianti"]["SSD"][z]["size"] ==
                    data.prodotto["SSD"]
                  ) {
                    console.log(product["varianti"]["SSD"][z]["size"]);
                    console.log(data.prodotto["SSD"]);
                    console.log("uguale");
                    id_ssd = product["varianti"]["SSD"][z]["SSD_Id"];
                    nome_ssd = product["varianti"]["SSD"][z]["size"];

                    console.log("TUTTE LE INFO");
                    console.log(cart["products"][x]["id"]);
                    console.log(cart["products"][x]["color"]);
                    console.log(cart["products"][x]["RAM"]);
                    console.log(cart["products"][x]["SSD"]);
                    console.log(id);
                    console.log(id_colore);
                    console.log(id_ram);
                    console.log(id_ssd);
                    if (
                      String(cart["products"][x]["id"]) == String(id) &&
                      String(cart["products"][x]["color"]) ==
                        String(id_colore) &&
                      String(cart["products"][x]["RAM"]) == String(id_ram) &&
                      String(cart["products"][x]["SSD"]) == String(id_ssd)
                    ) {
                      console.log("entra?");
                      cart["products"][x]["quantity"] =
                        parseFloat(cart["products"][x]["quantity"]) + 1;
                      console.log(cart["products"][x]["quantity"]);
                      prova = cart["products"];

                      var myquery = { email: data.email };
                      var newvalues = { $set: { products: prova } };
                      await db.collection("cart").updateOne(myquery, newvalues);
                      res.json({
                        prodotto: "incrementato",
                      });
                      a = 1;
                      return;
                    }
                  }
                }
              }
            }
          }
        }
      }
      if (a == 0) {
        var id_colore, id_ram, id_ssd, nome_colore, nome_ram, nome_ssd;
        for (var i = 0; i < product["varianti"]["colors"].length; i++) {
          if (
            product["varianti"]["colors"][i]["name"] == data.prodotto["color"]
          ) {
            id_colore = product["varianti"]["colors"][i]["color_Id"];
            nome_colore = product["varianti"]["colors"][i]["name"];
            prezzo_prodotto =
              prezzo_prodotto +
              parseFloat(product["varianti"]["colors"][i]["increase"]);
            image = product["varianti"]["colors"][i]["image"];
          }
        }
        for (var i = 0; i < product["varianti"]["RAM"].length; i++) {
          if (product["varianti"]["RAM"][i]["gb"] == data.prodotto["RAM"]) {
            id_ram = product["varianti"]["RAM"][i]["RAM_Id"];
            nome_ram = product["varianti"]["RAM"][i]["gb"];
            prezzo_prodotto =
              prezzo_prodotto +
              parseFloat(product["varianti"]["RAM"][i]["increase"]);
          }
        }
        for (var i = 0; i < product["varianti"]["SSD"].length; i++) {
          if (product["varianti"]["SSD"][i]["size"] == data.prodotto["SSD"]) {
            id_ssd = product["varianti"]["SSD"][i]["SSD_Id"];
            nome_ssd = product["varianti"]["SSD"][i]["size"];
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
          color: nome_colore,
          RAM: nome_ram,
          SSD: nome_ssd,
          price: prezzo_prodotto,
          image: image,
          quantity: data.prodotto["quantity"],
        };

        var obj_database = {
          id: product["_id"],
          brand: brand[0]["_id"],
          name: product["name"],
          category: category[0]["_id"],
          pollici: product["pollici"],
          processore: product["processore"],
          color: id_colore,
          RAM: id_ram,
          SSD: id_ssd,
          price: prezzo_prodotto,
          image: image,
          quantity: data.prodotto["quantity"],
        };
        cart["products"].push(obj_database);
        var myquery = { email: data.email };
        var newvalues = { $set: { products: cart["products"] } };
        await db.collection("cart").updateOne(myquery, newvalues);
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
