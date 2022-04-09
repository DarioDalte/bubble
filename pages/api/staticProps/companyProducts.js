module.exports = async function (db, email) {
  try {
    var user = await db.collection("companies").findOne({email: email); //Selects documents from collection categories

    if (user) {
      var prodotti = await db.collection("products").find({brand: user["_id"]}).toArray(); //Selects documents from collection categories

      res
        .status(201)
        .json({ "prodotti": prodotti });
      return;
    } else {
      res.status(200).json({ message: "Email inesistente", status: 0 });
    }

  } catch (e) {
    //error
    console.log("Errore " + e);
  }
};
