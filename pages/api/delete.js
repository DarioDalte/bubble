const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  try {
    await client.connect();

    let data = req.body; //Prendo il body della http request
    console.log(data);

    var nome = data[0]["name"];

    const db = client.db(); //Boh

    const collection = db.collection("users"); //Seleziono la collection
    await deleteListingByName(client, nome);

  } catch (err) {
    //... handle it locally
    console.log(err.message);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
    res.json({ message: "funzia!" });
  }
}

async function deleteListingByName(client, nameOfListing) {
  const result = await client
    .db("marketplace")
    .collection("users")
    .deleteOne({ name: nameOfListing });
  console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

/*
const { MongoClient } = require('mongodb');

async function main() {

    const uri = "mongodb+srv://marketplace:0W2iRdCWo1qqZqg8@cluster0.j9ybu.mongodb.net/marketplace?retryWrites=true&w=majority";


    const client = new MongoClient(uri);

    try {
        // Connect to the MongoDB cluster
        await client.connect();

    
        await deleteListingByName(client, "Lovely Loft");
        // Check that the listing named "Cozy Cottage" no longer exists
     

        await deleteListingsScrapedBeforeDate(client, new Date("2019-02-15"));
        // Check that the listing named "Ribeira Charming Duplex" still exists


    } finally {
        // Close the connection to the MongoDB cluster
        await client.close();
    }
}

main().catch(console.error);

async function deleteListingByName(client, nameOfListing) {
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#deleteOne for the deleteOne() docs
    const result = await client.db("marketplace").collection("users").deleteOne({ name: nameOfListing });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

async function deleteListingsScrapedBeforeDate(client, date) {
    // See https://mongodb.github.io/node-mongodb-native/3.6/api/Collection.html#deleteMany for the deleteMany() docs
    const result = await client.db("marketplace").collection("users").deleteMany({ "last_scraped": { $lt: date } });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

*/
