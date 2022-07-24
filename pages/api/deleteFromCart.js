const databaseConnection = require("./middlewares/database.js");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Calls the function databaseConnection

  const deleteProduct = async (cart, cartProducts, email) => {
    const myquery = { email: email };
    const newvalues = { $set: { products: cartProducts } };
    await cart.updateOne(myquery, newvalues);
    res.json({ message: "prodotto eliminato" });
  };

  try {
    const product = req.body; //Inserts the request data into the variable data
    const email = product.email;

    await client.connect(); //Connect to our cluster
    const db = client.db(); //Inserts db into the variable db

    const cartCollection = await db.collection("cart");
    const cart = await cartCollection.findOne({ email: email }); //Selects documents from collection product
    const cartProducts = cart.products;

    const equalProducts = [];

    cartProducts.map((cartProduct, i) => {
      if (cartProduct.id === product.id) {
        const obj = { ...cartProduct, index: i };
        equalProducts.push(obj);
      }
    });

    if (equalProducts.length === 1) {
      cartProducts.splice(equalProducts[0].index, 1);
      await deleteProduct(cartCollection, cartProducts, email);
    } else {
      for (let i = 0; i < equalProducts.length; i++) {
        const equalProduct = equalProducts[i];
        let equal = true;

        Object.keys(equalProduct.variant).map(async (mappedVariant, index) => {
          if (
            equalProduct.variant[mappedVariant] !=
            product.variant[mappedVariant].id
          ) {
            equal = false;
          }
        });

        if (equal) {
          cartProducts.splice(equalProduct.index, 1);
          await deleteProduct(cartCollection, cartProducts, email);
          break;
        }
      }
    }
  } finally {
    // Close the connection to the MongoDB cluster
    await client.close();
  }
}
