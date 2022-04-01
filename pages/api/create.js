const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  try {
    await client.connect();

    let data = req.body; //Prendo il body della http request
    console.log(data);

    const db = client.db(); //Boh

    const collection = db.collection("users"); //Seleziono la collection
    const result = await collection.insertMany(data); //Inserisco nella collection
    console.log("info inserite");
    res.json({ message: "funzia!" });
  } catch (err) {
    //... handle it locally
    console.log(err.message);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
    
  }
}
