import { ObjectId } from "mongodb";
import { hashPassowrd, verifyPassword } from "./middlewares/auth.js";
const databaseConnection = require("./middlewares/database.js");
const nodemailer = require("nodemailer");
const hbs = require("nodemailer-express-handlebars");
const path = require("path");
const mongoose = require("mongoose");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Calls the function databaseConnection

  try {
    var data = req.body; //Inserts the request data into the variable data

    await client.connect(); //Connect to our cluster
    const db = client.db(); //Inserts db into the variable db
    console.log(data.id);
    data.id = mongoose.Types.ObjectId(data.id);

    console.log(data.id);
    var product = await db
      .collection("products")
      .find({ _id: data.id })
      .toArray(); //Selects documents from collection product
    var id = data.id;
    console.log(product);
    if (product) {
    }

    res.json({
      message: "Nessun prodotto",
    });
    return;
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
