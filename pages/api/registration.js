import { hashPassowrd, verifyPassword } from "./middlewares/auth.js";
const databaseConnection = require("./middlewares/database.js");
const EmailTemplate = require("email-templates").EmailTemplate;
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");

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
    const db = client.db(); //Inserts db into the variable db
    if (data.company == true){
        collection = collection("users"); //Seleziono la collection
        var user = await collection
           .findOne({ email: data.email })
    }
    else{
        collection = collection("company"); //Seleziono la collection
        var user = await collection
           .findOne({ email: data.email })
    }
    
      

    if (!user) {
      data.password = await hashPassowrd(data.password); //encrypt the password
      
      await collection.insertOne(data); //Insert into users obj

      let transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "bubblebubbleproject@gmail.com",
          pass: "Bubble123!",
        },
      });

      const handlebarOptions = {
        viewEngine: {
          partialsDir: path.resolve("./pages/welcome/"),
          defaultLayout: false,
        },
        viewPath: path.resolve("./pages/welcome"),
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
