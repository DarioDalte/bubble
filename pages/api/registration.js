import { hashPassowrd } from "./middlewares/auth.js";
const databaseConnection = require("./middlewares/database.js");
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
const fs = require("fs");

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

    await client.connect(); //Connect to our cluster
    const db = client.db(); //Boh

    const usersCollection = db.collection("users");
    const user = await usersCollection.findOne({
      email: data.email,
    });

    const companiesCollection = db.collection("companies");
    const company = await companiesCollection.findOne({
      email: data.email,
    });

    if (!user && !company) {
      const transporter = nodemailer.createTransport(
        sendgridTransport({
          auth: {
            api_key:
              "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",
          },
        })
      );
      data.password = await hashPassowrd(data.password); //encrypt the password
      if (data.company) {
        await companiesCollection.insertOne(data);
      } else {
        let separato = data.name.split(" ");
        data.name = separato[0][0].toUpperCase() + separato[0].substring(1);
        data.cognome = separato[1][0].toUpperCase() + separato[1].substring(1);

        await usersCollection.insertOne(data);

        const cartObject = { email: data.email, products: [] };

        await db.collection("cart").insert(cartObject);

        const wishlistObject = {
          email: data.email,
          name: "Wishlist",
          products: [],
        };
        await db.collection("wishlist").insert(wishlistObject);
      }

      fs.readFile("email/welcome/welcome.html", "utf8", function (err, mail) {
        if (err) throw err;
        const template = String(mail).replace("username", data.name);
        transporter.sendMail({
          to: data.email,
          from: "bubble.mailing@gmail.com",
          fromname: "Bubble",
          subject: "Benvenuto su bubble!",
          html: template,
        });
      });

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
