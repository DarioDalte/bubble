const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  try {
    await client.connect();
    const db = client.db(); //Boh

    var data = req.body; //Inserts the request data into the variable data
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

    await db.collection("products").insertOne(data); //Selects documents from collection reviews

    res.status(200).json("Prodotto aggiunto nel database");
  } catch (e) {
    //error
    console.log("Error " + e);
  }
}
