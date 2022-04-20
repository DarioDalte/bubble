
const mongoose = require("mongoose");

const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  try {
    await client.connect();
 
    const db = client.db(); //Boh
    var data = req.body; //Inserts the request data into the variable data
    let yourId = mongoose.Types.ObjectId(data.id);
    var collection = db.collection("products"); //Seleziono la collection
    const prodotti = await collection.findOne({ _id: yourId });
    //Inserisco nella collection
    if (prodotti) {
      collection = db.collection("reviews"); //Seleziono la collection
      const reviews = await collection.find({ id_product: yourId }).toArray();

      var somma_recensioni = 0;
      var cont = 0;
      for (var b = 0; b < reviews.length; b++) {
        somma_recensioni = somma_recensioni + reviews[b]["value"];

        yourId = mongoose.Types.ObjectId(reviews[b]["id_user"]);
        var user = await db.collection("users").findOne({ _id: yourId });
        reviews[b]["id_user"] = user["name"] + " " + user["cognome"];
        cont++;
      }
      var media = somma_recensioni / cont;

      yourId = mongoose.Types.ObjectId(prodotti["brand"]);

      var brand = await db
        .collection("companies")
        .find({ _id: yourId })
        .toArray();
      //Selects documents from collection products
      var user = await db.collection("users").find({ _id: yourId }).toArray();

      prodotti["brand"] = brand[0]["name"];

      res.status(200).json({
        prodotto: prodotti,
        recensioni: reviews,
        star: media ? media : 0,
        numero_recensioni: cont,
      });
      return;
    } else {
      res.status(200).json({ message: "nessun prodotto" });
    }
  } catch (e) {
    //error
    console.log("Error " + e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
