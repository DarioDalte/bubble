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
        // var brand = await db
        //  .collection("companies")
        //  .findOne({ _id: prodotti[i]["brand"] });
        //Selects documents f
        //prodotti[i]["brand"] = brand["name"];
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
              //prodotti[i]["brand"] = companies[x]["name"];
              prodotti_ricerca.push(prodotti[i]);
            }
          }
        }
      }
    }
    var a = 0;

    for (var i = 0; i < result.length; i++) {
      var boh = result[i]["category"].toLowerCase();
      if (boh.includes(data.stringa)) {
        for (var z = 0; z < result[i]["orderdetails"].length; z++) {
          //var brand = await db
          //  .collection("companies")
          //  .findOne({ _id: result[i]["orderdetails"][z]["brand "] });
          //Selects documents f
          //result[i]["orderdetails"][z]["brand"] = brand["name"];
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
                      //var brand = await db.collection("companies").findOne({
                      //  _id: result[i]["orderdetails"][z]["brand"],
                      //});
                      //Selects documents f
                      //result[i]["orderdetails"][z]["brand"] = brand["name"];
                      prodotti_ricerca.push(result[i]["orderdetails"][z]);
                    }
                  }
                }
              }
            }
          }
        }
      }
    }

    for (var i = 0; i < prodotti_ricerca.length; i++) {
      delete prodotti_ricerca[i].category;
      delete prodotti_ricerca[i].varianti;
      delete prodotti_ricerca[i].pollici;
      delete prodotti_ricerca[i].processore;
      delete prodotti_ricerca[i].sub_categories;
      delete prodotti_ricerca[i].OS;
    }

    var cart = [];
    var recensioni = await db.collection("reviews").find().toArray(); //Selects documents from collection reviews
    var elenco_recensioni = []; //Declare and initialize elenco_recensioni
    var obj_recensioni = {}; //Declare and initialize obj_recensioni

    for (var i = 0; i < recensioni.length; i++) {
      let id = recensioni[i]["id_product"]
        .toString()
        .replace(/ObjectId\("(.*)"\)/, "$1");
      obj_recensioni = {
        id_prodotti: id,
        value: recensioni[i]["value"],
      };
      elenco_recensioni.push(obj_recensioni);
    }
    let oggetto = {};
    var cart = [];

    for (var x = 0; x < prodotti_ricerca.length; x++) {
      let id_prodotto = prodotti_ricerca[x]["_id"]
        .toString()
        .replace(/ObjectId\("(.*)"\)/, "$1");

      var somma_recensioni = 0;
      var cont = 0;
      for (var b = 0; b < elenco_recensioni.length; b++) {
        var singola_recensione = elenco_recensioni[b];
        var id_prodotto_recensito = singola_recensione["id_prodotti"];
        if (id_prodotto == id_prodotto_recensito) {
          somma_recensioni = somma_recensioni + singola_recensione["value"];
          cont++;
        }
      }
      var media = somma_recensioni / cont;
      let yourId = mongoose.Types.ObjectId(prodotti_ricerca[x]["brand"]);

      var brand = await db
        .collection("companies")
        .find({ _id: yourId })
        .toArray();
      //Selects documents from collection products

      prodotti_ricerca[x]["brand"] = brand[0]["name"];
      prodotti_ricerca[x]["star"] = media ? media : 0;
      //oggetto = {
      //prodotto: prodotti_ricerca[x],

      // star: media ? media : 0,
      //};
      cart.push(prodotti_ricerca[x]);
    }

    res.json({ prodotti: cart });
  } catch (err) {
    //... handle it locally
    console.log(err.message);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
