const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection();

  try {
    /**
     *   The await operator is used to wait for a Promise
     */
    await client.connect(); //To connect to our cluster

    const db = client.db(); //Boh

    var prodotti = await db.collection("products").find().toArray(); //Selects documents from collection categories

    var elenco_nomi = [];

    for (var i = 0; i < prodotti.length; i++) {
      elenco_nomi.push(prodotti[i]["name"]);
    }

    res.json({ message: elenco_nomi });
  } catch (err) {
    //... handle it locally
    console.log(err.message);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
