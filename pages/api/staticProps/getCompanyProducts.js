//module.exports = async function (db, email) {
const databaseConnection = require("../middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection();

  try {
    var data = req.body; //Inserts the request data into the variable data
    await client.connect(); //Connect to our cluster
    const db = client.db(); //Inserts db into the variable db
    var user = await db.collection("companies").findOne({ email: data.email }); //Selects documents from collection categories

    if (user) {
      var prodotti = await db
        .collection("products")
        .find({ brand: user["_id"] })
        .toArray(); //Selects documents from collection categories

      res.status(201).json({ prodotti: prodottigit });
      return;
    } else {
      res.status(200).json({ message: "Email inesistente", status: 0 });
    }
  } catch (e) {
    //error
    console.log("Errore " + e);
  }
}
