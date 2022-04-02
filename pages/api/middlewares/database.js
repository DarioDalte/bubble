import { MongoClient } from "mongodb";  //To connect to a MongoDB database

module.exports = async function () {
  const dbName = "marketplace"; //DB name
  const dbPassword = "0W2iRdCWo1qqZqg8";  //DB password

  /**
  * Connection URI
  */
  const uri = `mongodb+srv://${dbName}:${dbPassword}@cluster0.j9ybu.mongodb.net/marketplace?retryWrites=true&w=majority`;

  const client = new MongoClient(uri);  //create istance of MongoClient


  return client;
}
