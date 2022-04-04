import { hashPassowrd, verifyPassword } from "./middlewares/auth.js";
const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Calls the function databaseConnection

  try {
    const data = req.body; //Inserts the request data into the variable data
    var { email, password_vecchia, password_nuova } = data[0]; //takes email and password from data
    email = email.toLowerCase(); //Changes email to lowercase

    if (
      !email || //Email not null
      !email.includes("@") || //Email must contain the "@" sign
      !password_vecchia || //Password not null
      !password_nuova || //Password not null
      !password_nuova.trim().length > 7 //the password must contain at least 7 characters
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
    var encrypted_password = await hashPassowrd(password_nuova); //encrypt the password

    /***
     * flows users
     * compare emails
     * if are equals then compare the passwords and if are equals
     * then update password
     */
    for (var i = 0; i < numero_users; i++) {
      if (users[i]["email"] == email) {
        const isValid = await verifyPassword(
          password_vecchia,
          users[i]["password"]
        );
        if (isValid) {
          const collection = db.collection("users"); //Select collection users
          var myquery = { email: email };
          var newvalues = { $set: { password: encrypted_password } };
          await collection.updateOne(myquery, newvalues);

          res.status(422).json({
            message: "Account modificato",
          });
          return;
        }
      }
    }
    //send message if credentials are wrong
    res.json({ message: "Credenziali errate" });
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
