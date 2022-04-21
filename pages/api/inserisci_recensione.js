import { Logger } from "sass";
const mongoose = require("mongoose");

const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  try {
    await client.connect();
    const db = client.db(); //Boh
    var data = req.body; //Inserts the request data into the variable data
    var user = await db.collection("users").findOne({
      email: data.email,
    });
    let yourId = mongoose.Types.ObjectId(data.id_product);
    var collection = db.collection("reviews"); //Seleziono la collection
    var reviews = await collection.findOne({
      id_product: yourId,
      id_user: user["_id"],
    });
    //Inserisco nella collection

    if (!reviews) {
      var obj = {
        id_user: user["_id"],
        text: data.text,
        value: data.value,
        id_product: yourId,
        title: data.title
      };
      await db.collection("reviews").insertOne(obj);
      res.status(200).json({ status: 1, message: "Recensione aggiunta" });
      return;
    }

    res.status(200).json({ status: 0, message: "Prodotto già recensito" });
    return;
  } catch (e) {
    //error
    console.log("Error " + e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
