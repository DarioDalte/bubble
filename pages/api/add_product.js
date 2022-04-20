const databaseConnection = require("./middlewares/database.js");
const os = require("os");
const crypto = require("crypto");
const mongoose = require("mongoose");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  function objectId() {
    const seconds = Math.floor(new Date() / 1000).toString(16);
    const machineId = crypto
      .createHash("md5")
      .update(os.hostname())
      .digest("hex")
      .slice(0, 6);
    const processId = process.pid.toString(16).slice(0, 4).padStart(4, "0");
    const counter = process
      .hrtime()[1]
      .toString(16)
      .slice(0, 6)
      .padStart(6, "0");

    return seconds + machineId + processId + counter;
  }

  try {
    await client.connect();
    const db = client.db(); //Boh

    var data = req.body; //Inserts the request data into the variable data
    console.log("sono qui");
    console.log(data.varianti);
    console.log("sono qui");

    var companies = await db.collection("companies").find().toArray();
    for (var i = 0; i < companies.length; i++) {
      if (data.brand == companies[i]["name"]) {
        data.brand = companies[i]["_id"];
        break;
      }
    }

    var categories = await db.collection("categories").find().toArray();
    for (var i = 0; i < categories.length; i++) {
      if (data.category == categories[i]["category"]) {
        data.category = categories[i]["_id"];
        if (categories[i]["sub_category"]) {
          var keys = Object.keys(categories[i]["sub_category"]);
          var values = Object.values(categories[i]["sub_category"]);
          for (var f = 0; f < keys.length; f++) {
            if (data.sub_categories == keys[f]) {
              data.sub_categories = values[f];
            }
          }
        }
      }
    }
    for (var key in data.varianti) {
      for (var x = 0; x < data.varianti[key].length; x++) {
        data.varianti[key][x]["id"] = mongoose.Types.ObjectId(objectId());
      }
    }

    await db.collection("products").insertOne(data); //Selects documents from collection reviews

    res.status(200).json("Prodotto aggiunto nel database");
  } catch (e) {
    //error
    console.log("Error " + e);
  }
}
