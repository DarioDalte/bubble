const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection();

  try {
    const review = req.body;

    await client.connect(); //Connect to our cluster
    const db = client.db(); //Inserts db into the variable db

    const reviewCollection = await db.collection("reviews");

    const user = await db.collection("users").findOne({
      email: review.email,
    });

    const myquery = { id_user: user["_id"] };
    const newvalues = {
      $set: { text: review.text, value: review.value, title: review.title },
    };

    await reviewCollection.updateOne(myquery, newvalues);
    res.json({ message: "ERR" });
  } finally {
    await client.close();
  }
}
