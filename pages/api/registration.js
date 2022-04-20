import { Response } from "@sendgrid/helpers/classes";
import { json } from "micro";
import { sep } from "path";
import { hashPassowrd, verifyPassword } from "./middlewares/auth.js";
const databaseConnection = require("./middlewares/database.js");
const EmailTemplate = require("email-templates").EmailTemplate;
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const sgMail = require("@sendgrid/mail");
const API_KEY =
  "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";

export default async function handler(req, res) {
  const client = await databaseConnection(); //Calls the function databaseConnection

  try {
    const data = req.body; //Inserts the request data into the variable data
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

    var collection = "";
    //        const result = await collection.insertMany(data); //Inserisco nella collection

    await client.connect(); //Connect to our cluster

    const usersCollection = client.db().collection("users");
    const user = await usersCollection.findOne({
      email: data.email,
    });

    const companiesCollection = client.db().collection("companies");
    const company = await companiesCollection.findOne({
      email: data.email,
    });

    if (!user && !company) {
      data.password = await hashPassowrd(data.password); //encrypt the password
      if (data.company) {
        await companiesCollection.insertOne(data);
      } else {
        let separato = data.name.split(" ");
        data.name = separato[0];
        data.cognome = separato[1];
        await usersCollection.insertOne(data);
        const db = client.db(); //Boh
        var obj = { email: data.email, products: [] };
        // obj = JSON.parse(obj);

        await db.collection("cart").insert(obj);

        var obj = { email: data.email, name: "Wishlist", products: [] };
        // obj = JSON.parse(obj);

        await db.collection("wishlist").insert(obj);
      }

      sgMail.setApiKey(API_KEY);
      const message = {
        to: data.email,
        from: "bubblebubbleproject@gmail.com",
        template_id: "d-7de973dc3b4449729f2c76d881f0377b",
        personalizations: [
          {
            to: [
              {
                email: data.email,
              },
            ],
            subject: "REGISTRAZIONE",
            dynamic_template_data: {
              name: data.name,
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
          partialsDir: path.resolve("../bubble/email/welcome"),
          defaultLayout: false,
        },
        viewPath: path.resolve("../bubble/email/welcome"),
      };
      transporter.use("compile", hbs(handlebarOptions));

      let mailOption = {
        from: "bubblebubbleproject@gmail.com",
        to: data.email,
        subject: "Welcome",
        template: "email",
        context: {
          name: data.name, // replace {{name}} with Adebola
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
      res
        .status(201)
        .json({ message: "Registrazione effettuata con successo", status: 1 });
      return;
    } else {
      res.status(200).json({ message: "Utente già registrato!", status: 0 });
    }
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
