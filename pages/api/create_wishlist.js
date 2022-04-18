const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection();

  try {
    /**
     *   The await operator is used to wait for a Promise
     */
    await client.connect(); //To connect to our cluster

    let data = req.body; //Get data from HTTP request

    const db = client.db(); //Boh
    const wishlists = await db.collection("wishlist").findOne({
      email: data.email,
      name: data.name,
    });

    if (!wishlists) {
      var obj = { email: data.email, name: data.name, products: [] };
      await db.collection("wishlist").insertOne(obj);

      res.json({ message: "wishlist creata" });
      return;
    } else {
      res.json({ message: "Esiste già una wishlist con questo nome" });
      return;
    }
  } catch (err) {
    //... handle it locally
    console.log(err.message);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
