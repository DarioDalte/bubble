const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Mi connetto al db

  try {
    await client.connect();
    const db = client.db(); //Boh

    var result = await db
      .collection("categories")
      .aggregate([
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "category",
            as: "orderdetails",
          },
        },
      ])
      .toArray();

    console.log(result);
    function getRandomInt(max) {
      return Math.floor(Math.random() * max);
    }
    var primo_numero_random = getRandomInt(result.length); //Calls the function getRandomInt

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
      var numero_random = getRandomInt(result.length);
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

    var recensioni = await db.collection("reviews").find().toArray(); //Selects documents from collection reviews
    var elenco_recensioni = []; //Declare and initialize elenco_recensioni
    var obj_recensioni = {}; //Declare and initialize obj_recensioni

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
    var cart = [];
    console.log(numeri_random);
    var b = 0;
    var elementi_random = [];

    for (var d = 0; d < numeri_random.length; d++) {
      console.log("NUMERO RANDOM: " + d);
      for (var x = 0; x < result.length; x++) {
        if (numeri_random[d] == x) {
          console.log(result[x]["orderdetails"].length);
          for (var f = 0; f < result[x]["orderdetails"].length; f++) {
            if (result[x]["orderdetails"][f]) {
              let id_prodotto = result[x]["orderdetails"][f]["_id"]
                .toString()
                .replace(/ObjectId\("(.*)"\)/, "$1");
              console.log(id_prodotto);

              var somma_recensioni = 0;
              var cont = 0;
              for (var b = 0; b < elenco_recensioni.length; b++) {
                var singola_recensione = elenco_recensioni[b];
                var id_prodotto_recensito = singola_recensione["id_prodotti"];
                if (id_prodotto == id_prodotto_recensito) {
                  somma_recensioni =
                    somma_recensioni + singola_recensione["value"];
                  cont++;
                }
              }
              var media = somma_recensioni / cont;
              var brand = await db
                .collection("companies")
                .find({ _id: result[x]["orderdetails"][f]["brand"] })
                .toArray();
              //Selects documents from collection products

              if (id_prodotto == result[x]["orderdetails"][f]["_id"]) {
                result[x]["orderdetails"][f]["brand"] = brand[0]["name"];
                oggetto = {
                  prodotto: result[x]["orderdetails"][f],

                  star: media ? media : 0,
                };
                cart.push(oggetto);
                b = 1;
                if (cart.length == 8) {
                  break;
                }
              }
            } else {
              console.log("non ce");
            }
          }
        }

        if (b == 1) {
          b = 0;
          var oggetto_da_mandare = {
            categoria: result[x]["category"],
            prodotti: cart,
          };
          elementi_random.push(oggetto_da_mandare);
        }
        cart = [];
      }
    }

    res.json({
      elements: elementi_random,
    });
  } catch (e) {
    //error
    console.log("Errore " + e);
  }
}
