import { ObjectId } from "mongodb";
import { hashPassowrd, verifyPassword } from "./middlewares/auth.js";
const databaseConnection = require("./middlewares/database.js");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Calls the function databaseConnection

  try {
    var data = req.body; //Inserts the request data into the variable data
    console.log(data);
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
      users = await db.collection("users").find({ _id: id }).toArray(); //Selects documents from collection users

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "bubblebubbleproject@gmail.com",
          pass: "Bubble123!",
        },
      });

      const handlebarOptions = {
        viewEngine: {
          partialsDir: path.resolve("../bubble/email/modificare_dati"),
          defaultLayout: false,
        },
        viewPath: path.resolve("../bubble/email/modificare_dati"),
      };
      transporter.use("compile", hbs(handlebarOptions));

      let mailOption = {
        from: "bubblebubbleproject@gmail.com",
        to: users[0]["email"],
        subject: "Modifica",
        template: "email",
        context: {
          name: users[0]["name"], // replace {{name}} with Adebola
          company: "Bubble", // replace {{company}} with My Company
        },
      };

      transporter.sendMail(mailOption, function (err, success) {
        if (err) {
          console.log(err);
        } else {
          console.log("Email inviata");
        }
      });

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
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
