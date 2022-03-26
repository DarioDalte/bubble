import { elementAcceptingRef } from "@mui/utils";

const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  try {
    await client.connect(); //istanza mongo client

    const db = client.db(); //db

    var array_categorie = await db.collection("categories").find().toArray(); // inserisce nell'array le categorie
    const contatore_categorie = await db.collection("categories").countDocuments(); //conta quanti record ci sono nella collection categorie

    function getRandomInt(max) { // genera numero random
      return Math.floor(Math.random() * max);
    }

    var temp = getRandomInt(contatore_categorie);//primo numero random

    var array_numeri_random = [temp];//aggiunge il primo numero random all'array
    var a = 0;
    for (var i = 0; i < 2; i++) {
      temp = getRandomInt(contatore_categorie); // genera numero random e lo mette nella variabile temp
      for (var x = 0; x < array_numeri_random.length; x++) {
        if (temp == array_numeri_random[x]) { //confronta il numero generato con i numeri dell'array
          i = i - 1; // se è uguale decrementa
          a = 1; // e assegna 1 alla variabile a
        }
      }

      if (a == 0) { // se la variabile è 0 significa che non è presente il numero nell'array e lo aggiunge
        array_numeri_random.push(temp);
      } else { // altrimenti non lo aggiunge e assegna 0 alla variabile a
        a = 0;
      }
    }

    console.log(array_numeri_random);

    var array_con_id_categoria = [];
    for (var i = 0; i < array_categorie.length; i++) {
      var fa = array_categorie[i]["_id"];

      for (var z = 0; z < array_numeri_random.length; z++) {
        if (i == array_numeri_random[z]) {
          array_con_id_categoria.push(fa);
        }
      }
    }


    console.log("sono qui \n");
    var prodotti = await db.collection("products").find().toArray(); //prende i record della collezione orders e le mette nella variabile prova
    const contatore = await db.collection("products").countDocuments(); //conta quanti record ci sono nella collection orders
    console.log(contatore);
    console.log(prodotti);
    //sconsole.log(array_con_id_categoria);
    console.log("\n\n\n\n\n");

    var i = 0; //dichiaro e inizializo la varibile i
    var array = []; //dichiaro e inizializzo l'array
   
    while (i < contatore) {
      var prova_1 = prodotti[i]["category"]; //prendo il campo cod_prodotti(che è un array) e lo metto nella variabile prova_1
      console.log("id categoria del prodotto è: " + prova_1);
      console.log("        ");
      for (var d = 0; d < array_con_id_categoria.length; d++) {
        var asdas = array_con_id_categoria[d];
        asdas = String(asdas);
        console.log("id categoria confrontato è: " + asdas);
        
        if (prova_1 == asdas) {
            console.log("sono dentro");
            array.push(prova_1[d]); //aggiunge all'array ogni elemento dell'array prova_1
        }else{
            console.log("non è entrato");
        }
      }
      i++;
      console.log("\n\n\n\n\n\n\n\n");

    }

    console.log(array);

    res.status(200).json("ciao"); //response
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
