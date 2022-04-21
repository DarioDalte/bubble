const databaseConnection = require("./middlewares/database.js");
const mongoose = require("mongoose");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Calls the function databaseConnection

  const data = req.body; //Inserts the request data into the variable data

  await client.connect(); //Connect to our cluster
  const db = client.db(); //Inserts db into the variable db

  const wishlist = await db
    .collection("wishlist")
    .findOne({ email: data.email, name: data.name });
  console.log(wishlist);

  const wishlistProducts = [];
  let totalPrice = 0;
  if (wishlist.products) {
    for (var i = 0; i < wishlist["products"].length; i++) {
      console.log(wishlist["products"][i]);

      const dbProduct = await db
        .collection("products")
        .findOne({ _id: wishlist["products"][i] });

      const brandId = mongoose.Types.ObjectId(dbProduct["brand"]);
      var brand = await db.collection("companies").findOne({ _id: brandId });
      brand = brand.name;
      var price = parseFloat(dbProduct.price);

      var image = dbProduct["name"];

      var obj = {
        id: dbProduct["_id"],
        name: dbProduct["name"],
        brand: brand,
        price: price,
        image: image,
      };
      console.log(obj);
      wishlistProducts.push(obj);
    }

    console.log(wishlistProducts);

    res.json(wishlistProducts);

    await client.close();
    // console.log(wishlistProducts);
  } else {
    res.json({ message: "Non hai prodotti nel carrello" });
  }
}
