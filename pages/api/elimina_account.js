import { log } from "handlebars";
import { hashPassowrd, verifyPassword } from "./middlewares/auth.js";
const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Calls the function databaseConnection

  try {
    var data = req.body; //Inserts the request data into the variable data
    data.email = data.email.toLowerCase(); //Changes email to lowercase

    if (
      !data.email || //Email not null
      !data.email.includes("@") || //Email must contain the "@" sign
      !data.password || //Password not null
      !data.password.trim().length > 7 //the password must contain at least 7 characters
    ) {
      res.status(422).json({
        //message if wrong credentials
        message: "Invalid input",
      });
      return;
    }

    await client.connect(); //Connect to our cluster
    const db = client.db(); //Inserts db into the variable db
    var users = await db
      .collection("users")
      .find({ email: data.email })
      .toArray(); //Selects documents from collection users

    /***
     * flows users
     * compare emails
     * if are equals then compare the passwords and if are equals
     * then delete account and send message
     */
    if (users.length != 0) {
      if (users[0]["email"] == data.email) {
        const isValid = await verifyPassword(
          data.password,
          users[0]["password"]
        );

        if (isValid) {
          const collection = db.collection("users"); //Select collection users

          await collection.deleteOne({ email: data.email });
          res.status(422).json({
            message: "Account eliminato",
          });
          return;
        }
      }
    } else {
      //send message if credentials are wrong
      res.json({ message: "Credenziali errate" });
    }
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
