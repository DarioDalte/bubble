module.exports = async function (db) {
  try {
    var ordini = await db.collection("orders").find().toArray(); //Selects documents from collection orders
    const numero_ordini = await db.collection("orders").countDocuments(); //Return the count of documents

    var i = 0; //Declare and initialize i
    var cod_prodotti = []; //Declare and initialize cod_prodotti
    const cart = []; //Declare and initialize cart

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
      for (let i = 0; i < cod_prodotti.length; i++) {
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

    var gruppo_prodotti = count_duplicate(cod_prodotti); //Calls the function count_duplicate

    const sortable = Object.entries(gruppo_prodotti)
      .sort(([, a], [, b]) => a - b)
      .reduce((r, [k, v]) => ({ ...r, [k]: v }), {}); //Sort the dictionary

    var five_cod_products = [];

    /***
     * get the last 5 codes
     * adds the codes to the array
     */
    for (var i = 1; i < 6; i++) {
      var last = Object.keys(sortable)[Object.keys(sortable).length - i];
      five_cod_products.push(last);
    }

    var prodotti = await db.collection("products").find().toArray(); //Selects documents from collection products
    var recensioni = await db.collection("reviews").find().toArray(); //Selects documents from collection reviews
    var elenco_recensioni = []; //Declare and initialize elenco_recensioni
    var obj_recensioni = {}; //Declare and initialize obj_recensioni

    /***
     * from reviews takes ID and delete the special characters
     * adds the resulting ID and the review in obj_recensioni
     * in the end the resulting obj in elenco_recensioni
     */
    for (var i = 0; i < recensioni.length; i++) {
      let id = recensioni[i]["id_product"]
        .toString()
        .replace(/ObjectId\("(.*)"\)/, "$1");
      obj_recensioni = {
        id_prodotti: id,
        value: recensioni[i]["value"],
      };
      elenco_recensioni.push(obj_recensioni);
    }

    let oggetto = {};

    /***
     * flows five_cod_products
     * flows prodotti and
     * from prodotti takes ID and delete the special characters
     * flows elenco_recensioni
     * from elenco_recensioni takes the id of products which has been reviewed
     * compare ids and if they are equals then add the value of review to somma_recensioni
     * then increase the variable cont
     * after that calculate the average
     * then if the id are equals then add to obj oggetto the information to send
     * and add this obj to array cart
     * in the end the resulting obj in elenco_recensioni
     */
    for (i = 0; i < five_cod_products.length; i++) {
      for (var x = 0; x < prodotti.length; x++) {
        let id_prodotto = prodotti[x]["_id"]
          .toString()
          .replace(/ObjectId\("(.*)"\)/, "$1");

        var somma_recensioni = 0;
        var cont = 0;
        for (var b = 0; b < elenco_recensioni.length; b++) {
          var singola_recensione = elenco_recensioni[b];
          var id_prodotto_recensito = singola_recensione["id_prodotti"];
          if (id_prodotto == id_prodotto_recensito) {
            somma_recensioni = somma_recensioni + singola_recensione["value"];
            cont++;
          }
        }
        var media = somma_recensioni / cont;
        var brand = await db
          .collection("companies")
          .find({ _id: prodotti[x]["brand"] })
          .toArray(); //Selects documents from collection products

        if (id_prodotto == five_cod_products[i]) {
          oggetto = {
            brand: brand[0]["name"],
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
    //error
    console.log("Error " + e);
  }
};
