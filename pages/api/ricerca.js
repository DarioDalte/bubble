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
    const brand = await collection.find().toArray(); //Inserisco nella collection

    function capitalize(str) {
      const lower = str.toLowerCase();
      return str.charAt(0).toUpperCase() + lower.slice(1);
    }

    data.stringa = capitalize(data.stringa);

    var prodotti_ricerca = [];

    for (var i = 0; i < prodotti.length; i++) {
      var nome_prodotto = prodotti[i]["name"];
      console.log("prodotto selezionato: ");
      console.log(prodotti[i]);
      if (nome_prodotto.includes(data.stringa)) {
        prodotti_ricerca.push(nome_prodotto);
        console.log("prodotto aggiunto all'array");
      } else {
        let id_brand = prodotti[i]["brand"];
        console.log("brand prodotto");
        console.log(id_brand);
        for (var x = 0; x < brand.length; x++) {
          console.log("brand: ");
          console.log(brand[x]);
          if (brand[x]["_id"] == id_brand) {
            console.log("brand uguale!!!");
            if (brand[x]["name"].includes(data.stringa)) {
              console.log("contiene la ricerca!!!");

              prodotti_ricerca.push(nome_prodotto);
            }
          }
        }
      }
    }

    console.log(prodotti_ricerca);

    res.json({ message: "funzia!" });
  } catch (err) {
    //... handle it locally
    console.log(err.message);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
