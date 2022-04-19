const databaseConnection = require("./middlewares/database.js");
const mongoose = require("mongoose");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  try {
    await client.connect();
    const db = client.db(); //Boh

    const data = req.body; //Inserts the request data into the variable data
    let yourId = mongoose.Types.ObjectId(data.id);

    await db.collection("products").deleteOne({ _id: yourId }); //Selects documents from collection reviews

    res.status(200).json("Prodotto eliminato");
  } catch (e) {
    //error
    console.log("Error " + e);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
