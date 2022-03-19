const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  try {

    await client.connect(); //istanza mongo client

    const data = req.body; //Prendo il body della http request


    const db = client.db(); //db


    var prova = await db.collection("orders").find().toArray(); //prende i record della collezione orders e le mette nella variabile prova
    const contatore = await db.collection("orders").countDocuments(); //conta quanti record ci sono nella collection orders

    var i = 0; //dichiaro e inizializo la varibile i
    var array = []; //dichiaro e inizializzo l'array

    while (i < contatore) { 
      var prova_1 = prova[i]["cod_prodotti"]; //prendo il campo cod_prodotti(che è un array) e lo metto nella variabile prova_1
      for (var d = 0; d < prova_1.length; d++) { //
        array.push(prova_1[d]); //aggiunge all'array ogni elemento dell'array prova_1
      }
      i++;
    }



    function count_duplicate(a) { // crea un dizionario
      let counts = {};

      for (let i = 0; i < a.length; i++) {
        if (counts[a[i]]) {
          counts[a[i]] += 1;
        } else {
          counts[a[i]] = 1;
        }
      }
      for (let prop in counts) {
        if (counts[prop] >= 2) {
          console.log(prop + " counted: " + counts[prop] + " times.");
        }
      }
      return counts;
    }

    var best_seller = count_duplicate(array); //richiama la funzione passando l'array


    const sortable = Object.entries(best_seller) // ordina il dizionario per le keys 
      .sort(([, a], [, b]) => a - b)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    var array_5_bestseller = [];
    for (var i = 1; i < 6; i++) {
      var last = Object.keys(sortable)[Object.keys(sortable).length - i]; // Inserisce nell'array gli ultimi 5 elementi di best seller
      array_5_bestseller.push(last);
    }

    res.status(200).json(array_5_bestseller); //response
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
