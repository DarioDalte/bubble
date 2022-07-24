const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Calls the function databaseConnection

  try {
    const data = req.body; //Inserts the request data into the variable data

    await client.connect(); //Connect to our cluster
    const db = client.db(); //Inserts db into the variable db
    const id = data.id;

    const wishlist = await db
      .collection("wishlist")
      .findOne({ email: data.email, name: data.name }); //Selects documents from collection product

    if (wishlist.products.includes(String(id))) {
      const index = wishlist.products.indexOf(String(id));
      wishlist.products.splice(index, 1);

      const myquery = { email: data.email };
      const newvalues = { $set: { products: wishlist["products"] } };
      await db.collection("wishlist").updateOne(myquery, newvalues);
      res.json({ message: "Prodotto eliminato dalla wishlist!" });
    } else {
      res.json({ message: "Prodotto non presente nella wishlist" });
    }
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
