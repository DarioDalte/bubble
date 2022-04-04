import { hashPassowrd, verifyPassword } from "./middlewares/auth.js";
const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Calls the function databaseConnection

  try {
    const data = req.body; //Inserts the request data into the variable data
    var { email, password } = data[0]; //takes email and password from data
    email = email.toLowerCase(); //Changes email to lowercase

    if (
      !email || //Email not null
      !email.includes("@") || //Email must contain the "@" sign
      !password || //Email not null
      !password.trim().length > 7 //the password must contain at least 7 characters
    ) {
      res.status(422).json({
        //message if wrong credentials
        message: "Invalid input",
      });
      return;
    }

    await client.connect(); //Connect to our cluster
    const db = client.db(); //Inserts db into the variable db
    var users = await db.collection("users").find().toArray(); //Selects documents from collection users
    const numero_users = await db.collection("users").countDocuments(); //Return the count of documents

    /***
     * flows users
     * compare emails
     * if are equals then send msg
     */
    for (var i = 0; i < numero_users; i++) {
      if (users[i]["email"] == email) {
        res.status(422).json({
          message: "Ti sei gia registrato con questa mail",
        });
        return;
      }
    }

    var encrypted_password = await hashPassowrd(password); //encrypt the password
    /**
     * add email and password to obj oggetto
     */
    var oggetto = {
      email: email,
      password: encrypted_password,
    };

    const collection = db.collection("users"); //Select collection users

    users = await collection.insertOne(oggetto); //Insert into users obj

    res.json({ message: "Regsitrazione effettuata con successo" });
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
