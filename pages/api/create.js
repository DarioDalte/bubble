const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection();

  try {
    /** 
    *   The await operator is used to wait for a Promise
    */
    await client.connect();   //To connect to our cluster

    let data = req.body;    //Get data from HTTP request

    const db = client.db(); //Boh

    const collection = collection("users"); //Seleziono la collection
    const result = await collection.insertMany(data); //Inserisco nella collection
    res.json({ message: "funzia!" });
  } catch (err) {
    //... handle it locally
    console.log(err.message);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
    
  }
}
