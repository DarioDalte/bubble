const databaseConnection = require("./middlewares/database.js");
const mongoose = require("mongoose");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Calls the function databaseConnection

  const data = req.body; //Inserts the request data into the variable data

  await client.connect(); //Connect to our cluster
  const db = client.db(); //Inserts db into the variable db

  const cart = await db.collection("cart").findOne({ email: data.email });

  const cartProducts = [];
  let totalPrice = 0;
  if (cart.products) {
    let sumQnt = 0;
    await Promise.all(
      cart.products.map(async (product, i) => {
        console.log(product);
        sumQnt += product.qnt;

        const dbProduct = await db
          .collection("products")
          .findOne({ _id: product.id });

        const brandId = mongoose.Types.ObjectId(dbProduct["brand"]);
        const brand = await db
          .collection("companies")
          .findOne({ _id: brandId });
        dbProduct.brand = brand.name;
        dbProduct.price = parseFloat(dbProduct.price);

        if (product.variant) {
          Object.keys(product.variant).map((key) => {
            dbProduct.varianti[key].map((variant) => {
              if (variant.id.toString() === product.variant[key].toString()) {
                dbProduct.price += parseFloat(variant.increase);
              }
            });
          });
          delete dbProduct.varianti;
        }
        dbProduct["qnt"] = product.qnt;
        dbProduct.price *= product.qnt;
        totalPrice += dbProduct.price;
        cartProducts.push(dbProduct);
        if (i + 1 === cart.products.length) {
          console.log("fine");
        }
      })
    );

    const obj = {
      products: cartProducts,
      totalPrice: totalPrice,
      totalProducts: sumQnt,
    };

    res.json(obj);

    await client.close();
    // console.log(cartProducts);
  } else {
    res.json({ message: "Non hai prodotti nel carrello" });
  }
}
