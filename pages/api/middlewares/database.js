import { MongoClient } from "mongodb";

module.exports = async function () {
  const dbName = "marketplace";
  const dbPassword = "0W2iRdCWo1qqZqg8";

  const uri = `mongodb+srv://${dbName}:${dbPassword}@cluster0.j9ybu.mongodb.net/marketplace?retryWrites=true&w=majority`;

  const client = await MongoClient.connect(uri);


  return client;
}


