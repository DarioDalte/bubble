const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  try {
    await client.connect(); //istanza mongo client

    const data = req.body; //Prendo il body della http request


    const db = client.db(); //db

    const collection = db.collection("users"); //Seleziono la collection
    const result = await collection.insertMany(data); //Inserisco nella collection
    console.log("info inserite");
    console.log();
    res.json({ message: "funzia!" });
  } catch (err) {
    //... handle it locally
    console.log(err.message);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
    
  }
}

