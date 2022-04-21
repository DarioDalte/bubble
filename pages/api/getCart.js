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
        sumQnt += product.qnt;
        const productId = mongoose.Types.ObjectId(product.id);

        const dbProduct = await db
          .collection("products")
          .findOne({ _id: productId });

        const brandId = mongoose.Types.ObjectId(dbProduct.brand);
        const brand = await db
          .collection("companies")
          .findOne({ _id: brandId });
        const cartProduct = {
          id: dbProduct["_id"],
          image: dbProduct.image,
          name: dbProduct.name,
          brand: brand.name,
          price: parseFloat(dbProduct.price),
        };

        if (product.variant) {
          cartProduct.variant = {};
          Object.keys(product.variant).map((key) => {
            dbProduct.varianti[key].map((variant) => {
              if (variant.id.toString() === product.variant[key].toString()) {
                cartProduct.price += parseFloat(variant.increase);
                cartProduct.variant[key] = variant;
              }
            });
          });
        }
        cartProduct["qnt"] = product.qnt;
        cartProduct.price *= product.qnt;
        totalPrice += cartProduct.price;
        cartProducts.push(cartProduct);
      })
    );

    const obj = {
      products: cartProducts,
      totalPrice: totalPrice,
      totalProducts: sumQnt,
      status: 1,
    };

    res.json(obj);

    await client.close();
    // console.log(cartProducts);
  } else {
    res.json({ status: 0 });
  }
}
