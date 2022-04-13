const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  try {
    await client.connect();
    const db = client.db(); //Boh

    const data = req.body; //Inserts the request data into the variable data

    await db.collection("products").insertOne(data); //Selects documents from collection reviews

    res.status(200).json("Prodotto aggiunto nel database");
  } catch (e) {
    //error
    console.log("Error " + e);
  }
}
