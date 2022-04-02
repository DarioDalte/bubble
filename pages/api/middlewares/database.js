import { MongoClient } from "mongodb";    //Import MongoClient to connect to my MongoDB database

module.exports = async function () {
  const dbName = "marketplace";   //Database name
  const dbPassword = "0W2iRdCWo1qqZqg8";    //Password

  /**
  * Connection URI
  */
  const uri = `mongodb+srv://${dbName}:${dbPassword}@cluster0.j9ybu.mongodb.net/marketplace?retryWrites=true&w=majority`;

  //create an istance of MongoClient
  const client = new MongoClient(uri);


  return client; //return client
}
