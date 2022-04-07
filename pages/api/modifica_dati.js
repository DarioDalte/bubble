import { ObjectId } from "mongodb";
import { hashPassowrd, verifyPassword } from "./middlewares/auth.js";
const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Calls the function databaseConnection

  try {
    var data = req.body; //Inserts the request data into the variable data
    console.log(data);
    data.re;
    await client.connect(); //Connect to our cluster
    const db = client.db(); //Inserts db into the variable db
    data.id = ObjectId(data.id).valueOf();
    var users = await db.collection("users").find({ _id: data.id }).toArray(); //Selects documents from collection users
    var id = data.id;
    delete data.id;

    if (users.length != 0) {
      const collection = db.collection("users"); //Select collection users
      var myquery = { _id: id };
      var newvalues = { $set: data };
      await collection.updateOne(myquery, newvalues);
      res.json({
        message: "Account modificato",
      });
      return;
    } else {
      res.json({
        message: "Nessun utente ha questo id",
      });
      return;
    }

    /***
     * flows users
     * compare emails
     * if are equals then compare the passwords and if are equals
     * then update password
     */
    /*
    if (users.length != 0) {

        var myquery = { _id: data.id };
        var newvalues = { $set: { password: encrypted_password } };
        await collection.updateOne(myquery, newvalues);

    }
    */
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
