const mongoose = require("mongoose");

module.exports = async function (db, productID) {
  try {
    let yourId = mongoose.Types.ObjectId(productID);
    var collection = db.collection("products"); //Seleziono la collection
    const prodotti = await collection.findOne({ _id: yourId });
    //Inserisco nella collection
    if (prodotti) {
      collection = db.collection("reviews"); //Seleziono la collection
      const reviews = await collection.find({ id_product: yourId }).toArray();
      console.log(reviews);

      var somma_recensioni = 0;
      var cont = 0;
      for (var b = 0; b < reviews.length; b++) {
        somma_recensioni = somma_recensioni + reviews[b]["value"];

        yourId = mongoose.Types.ObjectId(reviews[b]["id_user"]);
        var user = await db.collection("users").findOne({ _id: yourId });
        console.log(user);
        if (user) {
          reviews[b]["id_user"] = user["name"] + " " + user["cognome"];
          reviews[b]["email"] = user.email;
          cont++;
        } else {
          reviews[b]["id_user"] = "Utente eliminato";
          cont++;
        }
      }
      var media = somma_recensioni / cont;

      yourId = mongoose.Types.ObjectId(prodotti["brand"]);

      var brand = await db
        .collection("companies")
        .find({ _id: yourId })
        .toArray();
      //Selects documents from collection products
      var user = await db.collection("users").find({ _id: yourId }).toArray();

      prodotti["brand"] = brand[0]["name"];

      return {
        prodotto: prodotti,
        recensioni: reviews,
        star: media ? media : 0,
        numero_recensioni: cont,
      };
    } else {
      return { message: "nessun prodotto" };
    }
  } catch (e) {
    //error
    console.log("Error " + e);
    return "error";
  }
};
