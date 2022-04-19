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
    console.log(user["_id"]);
    let yourId = mongoose.Types.ObjectId(data.id_product);
    console.log(yourId);
    const result = await db
      .collection("reviews")
      .deleteOne({ id_user: user["_id"], id_product: yourId });

    if (result["deletedCount"] != 0) {
      res.status(200).json({ message: "Recensione eliminata" });
      return;
    } else {
      res.status(200).json({ message: "Ops.. qualcosa è andato storto" });
      return;
    }
  } catch (e) {
    //error
    console.log("Error " + e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
