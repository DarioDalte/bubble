const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection();

  try {
    /**
     *   The await operator is used to wait for a Promise
     */
    await client.connect(); //To connect to our cluster

    let data = req.body; //Get data from HTTP request

    const db = client.db(); //Boh

    var collection = db.collection("products"); //Seleziono la collection
    const prodotti = await collection.find().toArray(); //Inserisco nella collection

    collection = db.collection("companies"); //Seleziono la collection
    const companies = await collection.find().toArray(); //Inserisco nella collection

    var stringa_1 = [];

    data.stringa = data.stringa.toLowerCase();
    data.stringa = data.stringa.split(" ").join("");
    stringa_1.push("RICERCA" + data.stringa + "\n");

    var prodotti_ricerca = [];
    var myJSON = "";

    for (var i = 0; i < prodotti.length; i++) {
      var nome_prodotto = prodotti[i]["name"];
      nome_prodotto = nome_prodotto.split(" ").join("");
      nome_prodotto = nome_prodotto.toLowerCase();
      myJSON = JSON.stringify(prodotti[i]);
      stringa_1.push("PRODOTTO: " + myJSON + "\n");

      if (nome_prodotto.includes(data.stringa)) {
        prodotti_ricerca.push(prodotti[i]["name"]);
        stringa_1.push("RICERCA PRESENTE NEL NOME DEL PRODOTTO: " + "\n");
      } else {
        let id_brand = prodotti[i]["brand"];
        stringa_1.push("ECCO L'ID DEL BRAND DEL PRODOTTO: " + id_brand + "\n");

        for (var x = 0; x < companies.length; x++) {
          myJSON = JSON.stringify(companies[x]);
          stringa_1.push("COMPANY: " + myJSON + "\n");
          var brand = companies[x]["_id"]
            .toString()
            .replace(/ObjectId\("(.*)"\)/, "$1");

          if (brand === String(id_brand)) {
            console.log("siiii è uguale");
            var nome = String(companies[x]["name"]);
            nome = nome.toLocaleLowerCase();
            if (nome.includes(data.stringa)) {
              console.log("siiii è uguale1");
              stringa_1.push(
                "PRODOTTO CONTENTE LA  RICERCA NEL NOME DEL BRAND" + "\n"
              );

              prodotti_ricerca.push(prodotti[i]["name"]);
            }
          }
        }
      }
    }

    stringa_1 = stringa_1.toString();

    const fs = require("fs");

    try {
      fs.writeFileSync(
        "C:/Users/Arslan/OneDrive/Desktop/bubble/pages/api/test.txt",
        stringa_1
      );
      //file written successfully
    } catch (err) {
      console.error(err);
    }

    res.json({ prodotti: prodotti_ricerca });
  } catch (err) {
    //... handle it locally
    console.log(err.message);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
