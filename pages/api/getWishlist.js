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

  const wishlistProducts = [];
  if (wishlist.products) {
    for (var i = 0; i < wishlist["products"].length; i++) {
      const dbProduct = await db
        .collection("products")
        .findOne({ _id: wishlist["products"][i] });

      const brandId = mongoose.Types.ObjectId(dbProduct["brand"]);
      var brand = await db.collection("companies").findOne({ _id: brandId });
      brand = brand.name;
      var price = parseFloat(dbProduct.price);

      var image = dbProduct["image"];

      var obj = {
        id: dbProduct["_id"],
        name: dbProduct["name"],
        brand: brand,
        price: price,
        image: image,
      };
      wishlistProducts.push(obj);
    }

    const object = {
      products: wishlistProducts,
      status: 1,
    };

    res.json(object);

    await client.close();
    // console.log(wishlistProducts);
  } else {
    res.json({ status: 0 });
    await client.close();
  }
}
