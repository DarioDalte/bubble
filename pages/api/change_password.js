import { hashPassowrd, verifyPassword } from "./middlewares/auth.js";
const databaseConnection = require("./middlewares/database.js");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const sgMail = require("@sendgrid/mail");
const API_KEY =
  "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";

export default async function handler(req, res) {
  const client = await databaseConnection(); //Calls the function databaseConnection

  try {
    var data = req.body; //Inserts the request data into the variable data
    data.email = data.email.toLowerCase(); //Changes email to lowercase

    if (
      !data.email || //Email not null
      !data.email.includes("@") || //Email must contain the "@" sign
      !data.password_vecchia || //Password not null
      !data.password_nuova || //Password not null
      !data.password_nuova.trim().length > 7 //the password must contain at least 7 characters
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
    var encrypted_password = await hashPassowrd(data.password_nuova); //encrypt the password

    /***
     * flows users
     * compare emails
     * if are equals then compare the passwords and if are equals
     * then update password
     */
    if (users.length != 0) {
      const isValid = await verifyPassword(
        data.password_vecchia,
        users[0]["password"]
      );

      if (isValid) {
        const collection = db.collection("users"); //Select collection users
        var myquery = { email: data.email };
        var newvalues = { $set: { password: encrypted_password } };
        await collection.updateOne(myquery, newvalues);

        sgMail.setApiKey(API_KEY);
        const message = {
          to: data.email,
          from: "bubblebubbleproject@gmail.com",
          template_id: "d-ce3a5931f35743d09a2a7f129f3aa179",
          personalizations: [
            {
              to: [
                {
                  email: data.email,
                },
              ],
              subject: "ACCOUNT MODIFICATO",
              dynamic_template_data: {
                name: users[0].name,
              },
            },
          ],
        };

        sgMail
          .send(message)
          .then((response) => console.log("Email inviata"))
          .catch((error) => console.log(error.message));
        /*
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
        */

        res.status(422).json({
          message: "Account modificato",
        });
        return;
      } else {
        res.status(422).json({
          message: "Credenziali errate",
        });
        return;
      }
    }

    res.status(422).json({
      message: "Nessun utente registrato con questa mail",
    });
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
