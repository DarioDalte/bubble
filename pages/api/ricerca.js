import { sassFalse } from "sass";

const databaseConnection = require("./middlewares/database.js");
const mongoose = require("mongoose");

export default async function handler(req, res) {
  const client = await databaseConnection();

  try {
    /**
     *   The await operator is used to wait for a Promise
     */
    await client.connect(); //To connect to our cluster

    let data = req.body; //Get data from HTTP request

    const db = client.db(); //Boh

    var collection = db.collection("products"); //Seleziono la collection
    const prodotti = await collection.find().toArray(); //Inserisco nella collection

    collection = db.collection("companies"); //Seleziono la collection
    const companies = await collection.find().toArray(); //Inserisco nella collection

    var result = await db
      .collection("categories")
      .aggregate([
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "category",
            as: "orderdetails",
          },
        },
      ])
      .toArray();

    var stringa_1 = [];

    data.stringa = data.stringa.toLowerCase();
    data.stringa = data.stringa.split(" ").join("");

    var prodotti_ricerca = [];
    var myJSON = "";

    for (var i = 0; i < prodotti.length; i++) {
      var nome_prodotto = prodotti[i]["name"];
      nome_prodotto = nome_prodotto.split(" ").join("");
      nome_prodotto = nome_prodotto.toLowerCase();
      myJSON = JSON.stringify(prodotti[i]);

      if (nome_prodotto.includes(data.stringa)) {
        prodotti_ricerca.push(prodotti[i]);
      } else {
        let id_brand = prodotti[i]["brand"];

        for (var x = 0; x < companies.length; x++) {
          myJSON = JSON.stringify(companies[x]);
          var brand = companies[x]["_id"]
            .toString()
            .replace(/ObjectId\("(.*)"\)/, "$1");

          if (brand === String(id_brand)) {
            var nome = String(companies[x]["name"]);
            nome = nome.toLocaleLowerCase();
            if (nome.includes(data.stringa)) {
              prodotti_ricerca.push(prodotti[i]);
            }
          }
        }
      }
    }
<<<<<<< Updated upstream
    var a = 0;

    for (var i = 0; i < result.length; i++) {
      var boh = result[i]["category"].toLowerCase();
      if (boh.includes(data.stringa)) {
        for (var z = 0; z < result[i]["orderdetails"].length; z++) {
          prodotti_ricerca.push(result[i]["orderdetails"][z]);
          a = 1;
        }
      }
    }
    if (a == 0) {
      for (var i = 0; i < result.length; i++) {
        if (result[i]["sub_category"]) {
          var keys = Object.keys(result[i]["sub_category"]);
          var values = Object.values(result[i]["sub_category"]);

          for (var f = 0; f < keys.length; f++) {
            if (keys[f].toLowerCase().includes(data.stringa)) {
              for (var z = 0; z < result[i]["orderdetails"].length; z++) {
                var variabile = result[i]["orderdetails"][z]["sub_categories"];
                if (variabile) {
                  for (var r = 0; r < variabile.length; r++) {
                    variabile[r] = variabile[r]
                      .toString()
                      .replace(/ObjectId\("(.*)"\)/, "$1");

                    values[f] = values[f]
                      .toString()
                      .replace(/ObjectId\("(.*)"\)/, "$1");

                    if (variabile[r] == values[f]) {
                      prodotti_ricerca.push(result[i]["orderdetails"][z]);
                    }
                  }
                }
              }
            }
          }
        }
      }
=======

    stringa_1 = stringa_1.toString();

    const fs = require("fs");

    try {
      fs.writeFileSync(
        "./test.txt",
        stringa_1
      );
      //file written successfully
    } catch (err) {
      console.error(err);
>>>>>>> Stashed changes
    }

    res.json({ prodotti: prodotti_ricerca });
  } catch (err) {
    //... handle it locally
    console.log(err.message);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
