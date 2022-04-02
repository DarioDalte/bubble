module.exports = async function (db) {
  try {
    var array_categorie = await db.collection("categories").find().toArray(); // inserisce nell'array le categorie
    const contatore_categorie = await db
      .collection("categories")
      .countDocuments(); //conta quanti record ci sono nella collection categorie

    function getRandomInt(max) {
      // genera numero random
      return Math.floor(Math.random() * max);
    }

    var temp = getRandomInt(contatore_categorie); //primo numero random

    var array_numeri_random = [temp]; //aggiunge il primo numero random all'array
    var a = 0;
    for (var i = 0; i < 2; i++) {
      temp = getRandomInt(contatore_categorie); // genera numero random e lo mette nella variabile temp
      for (var x = 0; x < array_numeri_random.length; x++) {
        if (temp == array_numeri_random[x]) {
          //confronta il numero generato con i numeri dell'array
          i = i - 1; // se è uguale decrementa
          a = 1; // e assegna 1 alla variabile a
        }
      }

      if (a == 0) {
        // se la variabile è 0 significa che non è presente il numero nell'array e lo aggiunge
        array_numeri_random.push(temp);
      } else {
        // altrimenti non lo aggiunge e assegna 0 alla variabile a
        a = 0;
      }
    }

    var array_con_id_categoria = []; //dichiaro l'array che conterra gli id delle categorie che verranno visualizzate nella home page
    for (var i = 0; i < array_categorie.length; i++) {
      //scorre l'array_categorie che contiene tutte le categorie prese dal db
      var var_id = array_categorie[i]["_id"]; // prende solo l'id e lo mette nella variabile var_id

      for (var z = 0; z < array_numeri_random.length; z++) {
        //scorre l'array con i numeri random e lo mette nell'array con categoria id
        if (i == array_numeri_random[z]) {
          array_con_id_categoria.push(var_id);
        }
      }
    }

    var prodotti = await db.collection("products").find().toArray(); //prende i record della collezione orders e le mette nella variabile prova
    const contatore2 = await db.collection("products").countDocuments(); //conta quanti record ci sono nella collection orders
    //console.log(prodotti); //printa i prodotti presi dal db

    var array = []; //dichiaro e inizializzo l'array
    let oggetto2 = {}; //dichiaro due oggetti e due array e una variabile prova_3
    var oggetto_da_mandare = {};
    var array_da_mandare = [];
    var cart2 = [];

    var prova_3 = 0;
    for (var d = 0; d < array_con_id_categoria.length; d++) {
      //scansiono l'array con gli id delle categorie

      var prova_1 = array_con_id_categoria[d]; // inserisco un id alla volta nella variabile prova_1
      var nome_categoria = await db
        .collection("categories")
        .find({ _id: prova_1 })
        .toArray(); // inserisce nell'array le categorie
      nome_categoria = nome_categoria[0]["category"];
      prova_1 = String(array_con_id_categoria[d]); // e la trasformo in stringa
      var i = 0; //dichiaro e inizializo la varibile i
      while (i < contatore2) {
        //scorre l'array che contiene i prodotti
        var prova_2 = prodotti[i]["category"]; //prendo il campo category e lo metto nella variabile prova_2
        if (prova_2 == prova_1) {
          //la confronto e solo se è uguale, quindi gli id sono identici entra nell'if
          oggetto2 = {
            brand: prodotti[i]["brand"],
            name: prodotti[i]["name"],
            price: prodotti[i]["price"],
          }; //aggiunge all'oggetto oggetto, dichiarato precedentemente, le informazioni del prodotto
          cart2.push(oggetto2); // e aggiunge le info del prodotto all'array cart
          prova_3 = 1; //e assegna alla variabile prova_3 il valore 1, in questo modo posso sapere se è passato per questo if

          if (cart2.length == 5) {
            break;
          }
        }
        i++;
      }

      if (prova_3 == 1) {
        // se è entrato assegan 0 alla variabile prova_3 e aggiunge l'array all'oggetto oggetto da mandare che lo pusha nell'array definitivo che verra inivato al frontend
        prova_3 = 0;
        oggetto_da_mandare = {
          categoria: nome_categoria,
          prodotti: cart2,
        };
        array_da_mandare.push(oggetto_da_mandare);
      }
      cart2 = [];
    }
    return array_da_mandare;
  } catch(e) {
    // Close the connection to the MongoDB cluster
    console.log("Errore " + e);
  }
}
