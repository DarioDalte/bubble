import { OpacityRounded } from "@material-ui/icons";

const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection();

  try {
    await client.connect(); //To connect to our cluster

    const db = client.db(); //Boh

    var result = await db
      .collection("orders")
      .aggregate([
        {
          $lookup: {
            from: "products",
            localField: "cod_prodotti",
            foreignField: "_id",
            as: "orderdetails",
          },
        },
      ])
      .toArray();
    var prodotti = [];
    for (var i = 0; i < result.length; i++) {
      for (var x = 0; x < result[i]["orderdetails"].length; x++) {
        prodotti.push(result[i]["orderdetails"][x]);
      }
    }
    console.log(prodotti);
    function count_duplicate(prodotti) {
      let counts = {};
      for (let i = 0; i < prodotti.length; i++) {
        if (counts[prodotti[i]["_id"]]) {
          counts[prodotti[i]["_id"]] += 1;
        } else {
          counts[prodotti[i]["_id"]] = 1;
        }
      }
      return counts;
    }
    var group = count_duplicate(prodotti); //Calls the function count_duplicate
    group = Object.entries(group)
      .sort(([, a], [, b]) => a - b)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {}); //Sort the dictionary
    console.log(group);
    var five_cod_products = [];
    for (var i = 1; i < 6; i++) {
      var last = Object.keys(group)[Object.keys(group).length - i];
      five_cod_products.push(last);
    }
    console.log(five_cod_products);
    var a = 0;
    var prodotti_finali = [];
    console.log(five_cod_products);
    for (var i = 0; i < five_cod_products.length; i++) {
      for (var x = 0; x < prodotti.length; x++) {
        if (five_cod_products[i] == prodotti[x]["_id"] && a == 0) {
          prodotti_finali.push(prodotti[x]);
          a = 1;
        }
      }
      a = 0;
    }

    res.status(422).json({
      message: prodotti_finali,
    });
    return;
  } catch (e) {
    //error
    console.log("Error " + e);
  }
}
