module.exports = async function (db) {
  try {
    var ordini = await db.collection("orders").find().toArray(); //Selects documents in collection orders
    const numero_ordini = await db.collection("orders").countDocuments(); //Return the count of documents

    var i = 0;  //Declare and initialize i
    var cod_prodotti = []; //Declare and initialize cod_prodotti
    const cart = [];  //Declare and initialize cart

    while (i < numero_ordini) {
      var elenco_cod_prodotti = ordini[i]["cod_prodotti"]; //takes cod_prodotti field (which is an array)
      for (var d = 0; d < elenco_cod_prodotti.length; d++) {
        cod_prodotti.push(elenco_cod_prodotti[d]); //Adds the ordered products code
      }
      i++;
    }

    /**
     * Groups the product codes
     * @param cod_prodotti product codes passed to the function to group
     * @returns an object with product code and number of times present in the array
     */
    function count_duplicate(cod_prodotti) {
      let counts = {};
      for (let i = 0; i < a.length; i++) {
        if (counts[cod_prodotti[i]]) {
          counts[cod_prodotti[i]] += 1;
        } else {
          counts[cod_prodotti[i]] = 1;
        }
      }
      return counts;
    }

    //!SE NON TI FUNZIA IL SITO AGGIUNGI QUESTO PRIMA DI RETURN COUNTS
     /** for (let prop in counts) {
        if (counts[prop] >= 2) {
          console.log(prop + " counted: " + counts[prop] + " times.");
        }
      }
       */
    

    var best_seller = count_duplicate(cod_prodotti); //Calls the function count_duplicate

    const sortable = Object.entries(best_seller) // ordina il dizionario per le keys
      .sort(([, a], [, b]) => a - b)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    var array_5_bestseller = [];
    for (var i = 1; i < 6; i++) {
      var last = Object.keys(sortable)[Object.keys(sortable).length - i]; // Inserisce nell'cod_prodotti gli ultimi 5 elementi di best seller
      array_5_bestseller.push(last);
    }

    //console.log("best seller: " + array_5_bestseller);

    var prodotti = await db.collection("products").find().toArray(); //prende i record della collezione orders e le mette nella variabile ordini
    var recensioni = await db.collection("reviews").find().toArray();
    var array_recensioni = [];
    var oggetto_recensioni = {};
    for (var i = 0; i < recensioni.length; i++) {
      let id = recensioni[i]["id_product"]
        .toString()
        .replace(/ObjectId\("(.*)"\)/, "$1");
      oggetto_recensioni = {
        id_prodotti: id,
        value: recensioni[i]["value"],
      };
      array_recensioni.push(oggetto_recensioni);
    }

    //console.log(array_recensioni);

    let oggetto = {};

    for (i = 0; i < array_5_bestseller.length; i++) {
      //console.log("best seller n" + i + " " + array_5_bestseller[i] + "\n");
      for (var x = 0; x < prodotti.length; x++) {
        let id = prodotti[x]["_id"]
          .toString()
          .replace(/ObjectId\("(.*)"\)/, "$1");

        var somma = 0;
        var cont = 0;
        for (var b = 0; b < array_recensioni.length; b++) {
          var ogg = array_recensioni[b];
          var prova_2 = ogg["id_prodotti"];
          //console.log(prova_2);
          if (id == prova_2) {
            somma = somma + ogg["value"];
            cont++;
          }
        }
        var media = somma / cont;
        //console.log("id: " + id);
        if (id == array_5_bestseller[i]) {
          oggetto = {
            brand: prodotti[x]["brand"],
            name: prodotti[x]["name"],
            price: prodotti[x]["price"],
            star: media ? media : 0,
          };
          cart.push(oggetto);

          break;
        }
      }
    }

    return cart;
  } catch (e) {
    // Close the connection to the MongoDB cluster
    console.log("Error " + e);
  }
};
