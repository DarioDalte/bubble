import { Logger } from "sass";
const mongoose = require("mongoose");

const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  try {
    await client.connect();
    const db = client.db(); //Boh
    var data = req.body; //Inserts the request data into the variable data
    let yourId = mongoose.Types.ObjectId(data.prodotto["_id"]);
    var collection = db.collection("products"); //Seleziono la collection
    const prodotti = await collection.findOne({ _id: yourId });
    //Inserisco nella collection
    console.log(prodotti);
    if (prodotti) {
      collection = db.collection("reviews"); //Seleziono la collection
      const reviews = await collection.find({ id_product: yourId }).toArray();
      console.log(reviews);

      yourId = mongoose.Types.ObjectId(prodotti["brand"]);

      var brand = await db
        .collection("companies")
        .find({ _id: yourId })
        .toArray();
      //Selects documents from collection products

      prodotti["brand"] = brand[0]["name"];

      res.status(200).json({
        prodotto: prodotti,
        recensioni: reviews,
      });
    } else {
      res.status(200).json({ message: "nessun prodotto" });
    }
    /*
    var prodotti = [];
    for (var i = 0; i < result.length; i++) {
      for (var x = 0; x < result[i]["orderdetails"].length; x++) {
        prodotti.push(result[i]["orderdetails"][x]);
      }
    }
    function count_duplicate(prodotti) {
      let counts = {};
      for (let i = 0; i < prodotti.length; i++) {
        if (counts[prodotti[i]["_id"]]) {
          counts[prodotti[i]["_id"]] += 1;
        } else {
          counts[prodotti[i]["_id"]] = 1;
        }
      }
      return counts;
    }
    var group = count_duplicate(prodotti); //Calls the function count_duplicate
    group = Object.entries(group)
      .sort(([, a], [, b]) => a - b)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {}); //Sort the dictionary
    var five_cod_products = [];
    for (var i = 1; i < 6; i++) {
      var last = Object.keys(group)[Object.keys(group).length - i];
      five_cod_products.push(last);
    }
    var a = 0;
    var prodotti_finali = [];
    for (var i = 0; i < five_cod_products.length; i++) {
      for (var x = 0; x < prodotti.length; x++) {
        if (five_cod_products[i] == prodotti[x]["_id"] && a == 0) {
          prodotti_finali.push(prodotti[x]);
          a = 1;
        }
      }
      a = 0;
    }
    prodotti_finali = JSON.stringify(prodotti_finali);
    prodotti_finali = JSON.parse(prodotti_finali);

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

    for (var x = 0; x < prodotti_finali.length; x++) {
      let id_prodotto = prodotti_finali[x]["_id"]
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

      let yourId = mongoose.Types.ObjectId(prodotti_finali[x]["brand"]);

      var brand = await db
        .collection("companies")
        .find({ _id: yourId })
        .toArray();
      //Selects documents from collection products

      prodotti_finali[x]["brand"] = brand[0]["name"];
      oggetto = {
        prodotto: prodotti_finali[x],

        star: media ? media : 0,
      };
      cart.push(oggetto);
    }
    cart = JSON.stringify(cart);
    cart = JSON.parse(cart);
    res.status(200).json(cart);
    */
  } catch (e) {
    //error
    console.log("Error " + e);
  }
}
