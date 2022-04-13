const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  try {
    await client.connect();
    const db = client.db(); //Boh

    var categorie = await db.collection("categories").find().toArray(); //Selects documents from collection categories
    const numero_categorie = await db.collection("categories").countDocuments(); //Return the count of documents

    /***
     *  Generate random numbers
     */
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }

    var primo_numero_random = getRandomInt(numero_categorie); //Calls the function getRandomInt

    var numeri_random = [primo_numero_random]; //Adds first random number
    var a = 0;

    /***
     * Call the fucion getRandomInt for 2 times and generate an random number
     * flows numeri_random and check that the random number is not present in the array
     * if it is decrease i and assing 1 to a
     * then chek if a is 0, if it is, it means that it is a new number and so add tu numeri_random
     * otherwise assing 0 to a and repeat
     */
    for (var i = 0; i < 2; i++) {
      var numero_random = getRandomInt(numero_categorie);
      for (var x = 0; x < numeri_random.length; x++) {
        if (numero_random == numeri_random[x]) {
          i = i - 1;
          a = 1;
        }
      }

      if (a == 0) {
        numeri_random.push(numero_random);
      } else {
        a = 0;
      }
    }

    var id_categorie = []; //Declare and initialize id_categorie

    /***
     * flows categorie
     * from categorie takes ID
     * flows numeri_random
     * compare variable i and z and if they are equals then add the cateogry id
     */
    for (var i = 0; i < categorie.length; i++) {
      var id = categorie[i]["_id"];

      for (var z = 0; z < numeri_random.length; z++) {
        if (i == numeri_random[z]) {
          id_categorie.push(id);
        }
      }
    }

    var prodotti = await db.collection("products").find().toArray(); //Selects documents from collection products
    const numero_prodotti = await db.collection("products").countDocuments(); //Selects documents from collection products

    let oggetto = {};

    var elementi_random = [];
    var cart = [];

    var b = 0;

    /***
     *  flows id_categorie, takes the id and query the db that returns the informations of category
     *  transform id in String
     * if b is 1 assing 0 to b and then add the array to obj oggett_da_mandare and then add this obj
     * in elementi_random
     */
    for (var d = 0; d < id_categorie.length; d++) {
      var id_categoria = id_categorie[d];
      var nome_categoria = await db
        .collection("categories")
        .find({ _id: id_categoria })
        .toArray();
      nome_categoria = nome_categoria[0]["category"];
      id_categoria = String(id_categorie[d]);
      var i = 0;
      /***
       * flows prodotti, takes the product category
       * compare ids and if they are equals then add the information of product in obj oggetto
       * and add this obj to array cart and assing 1 to b
       */

      while (i < numero_prodotti) {
        var id_prod = prodotti[i]["category"];
        var brand = await db
          .collection("companies")
          .find({ _id: prodotti[i]["brand"] })
          .toArray(); //Selects documents from collection products
        if (id_prod == id_categoria) {
          oggetto = {
            brand: brand[0]["name"],
            name: prodotti[i]["name"],
            price: prodotti[i]["price"],
          };
          cart.push(oggetto);
          b = 1;

          if (cart.length == 8) {
            break;
          }
        }
        i++;
      }

      if (b == 1) {
        b = 0;
        var oggetto_da_mandare = {
          categoria: nome_categoria,
          prodotti: cart,
        };
        elementi_random.push(oggetto_da_mandare);
      }
      cart = [];
    }
    res.status(200).json(elementi_random);
  } catch (e) {
    //error
    console.log("Errore " + e);
  }
}
