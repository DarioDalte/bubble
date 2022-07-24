const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Calls the function databaseConnection

  const insertProduct = async (cart, cartProducts, email) => {
    const myquery = { email: email };
    const newvalues = { $set: { products: cartProducts } };
    await cart.updateOne(myquery, newvalues);
    res.json({ message: "prodotto inserito" });
  };

  try {
    const product = req.body; //Inserts the request data into the variable data
    const email = product.email;
    delete product.email;

    await client.connect(); //Connect to our cluster
    const db = client.db(); //Inserts db into the variable db

    const cartCollection = await db.collection("cart");
    const cart = await cartCollection.findOne({ email: email }); //Selects documents from collection product
    const cartProducts = cart.products;

    const equalProducts = [];

    if (cartProducts.length != 0) {
      cartProducts.map((cartProduct) => {
        if (cartProduct.id === product.id) {
          equalProducts.push(cartProduct);
        }
      });

      if (equalProducts.length != 0) {
        if (Object.keys(product.variant).length != 0) {
          let noEqual = true;
          for (let i = 0; i < equalProducts.length; i++) {
            const equalProduct = equalProducts[i];
            let equal = true;

            Object.keys(equalProduct.variant).map(
              async (mappedVariant, index) => {
                if (
                  equalProduct.variant[mappedVariant] !=
                  product.variant[mappedVariant]
                ) {
                  equal = false;
                }
              }
            );

            if (equal) {
              equalProducts[i].qnt += product.qnt;
              await insertProduct(cartCollection, cartProducts, email);
              noEqual = false;
              break;
            }
          }
          if (noEqual) {
            cartProducts.push(product);
            await insertProduct(cartCollection, cartProducts, email);
          }
        } else {
          equalProducts[0].qnt += product.qnt;
          await insertProduct(cartCollection, cartProducts, email);
        }
      } else {
        cartProducts.push(product);
        await insertProduct(cartCollection, cartProducts, email);
      }
    } else {
      cartProducts.push(product);
      await insertProduct(cartCollection, cartProducts, email);
    }
  } finally {
    // Close the connection to the MongoDB cluster

    await client.close();
  }
}
