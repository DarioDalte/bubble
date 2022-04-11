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


    console.log(brand);

    function capitalize(str) {
      const lower = str.toLowerCase();
      return str.charAt(0).toUpperCase() + lower.slice(1);
    }

    data.stringa = capitalize(data.stringa);


    var prodotti_ricerca = [];
    var myJSON = "";
    var stringa_1 = [];
    var stringa_2 = "";
    var stringa_3 = "";
    var stringa_4 = "";

    var stringa_4 = "";


    for (var i = 0; i < prodotti.length; i++) {
      var nome_prodotto = prodotti[i]["name"];
      myJSON = JSON.stringify(prodotti[i]);
      stringa_1.push("prodotto selezionato: " + myJSON + "\n");


      if (nome_prodotto.includes(data.stringa)) {
        prodotti_ricerca.push(nome_prodotto);
        stringa_1.push("prodotto  aggiunto all'array: " + myJSON + "\n");


      } else {
        let id_brand = prodotti[i]["brand"];  
        stringa_1.push("brand prodotto: " + id_brand + "\n");



        
        for (var x = 0; x < brand.length; x++) {
        

          myJSON = JSON.stringify(brand[x]);
          stringa_1.push("brand: " + myJSON);


          if (brand[x]["_id"] == id_brand) {
            if (brand[x]["name"].includes(data.stringa)) {
              stringa_1.push("prodotto aggiunto ricerca" + "\n");
          

              prodotti_ricerca.push(nome_prodotto);
            }
          }
        }
      }
    }

    console.log(prodotti_ricerca);
    
    stringa_1 = stringa_1.toString();
  
    const fs = require('fs')

    
    try {
      fs.writeFileSync('C:/Users/navfl/OneDrive/Desktop/Projects/bubble/pages/api/test.txt', stringa_1)
      //file written successfully
    } catch (err) {
      console.error(err)
    }
    


    res.json({ message: "funzia!" });
  } catch (err) {
    //... handle it locally
    console.log(err.message);
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
