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

    const result = await db
      .collection("wishlist")
      .deleteOne({ email: data.email, name: data.name });

    console.log(result["deletedCount"]);
    if (parseFloat(result["deletedCount"]) != 0) {
      res.json({ message: "wishlist eliminata" });
      return;
    } else {
      res.json({ message: "Ops.. qualcosa è andato storto" });
      return;
    }
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
