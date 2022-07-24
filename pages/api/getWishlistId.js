const databaseConnection = require("./middlewares/database.js");
const { ObjectId } = require("mongodb");

export default async function handler(req, res) {
  const client = await databaseConnection(); //Calls the function databaseConnection

  const data = req.body; //Inserts the request data into the variable data

  await client.connect(); //Connect to our cluster
  const db = client.db(); //Inserts db into the variable db

  const wishlist = await db
    .collection("wishlist")
    .findOne({ email: data.email, name: data.name });

  if(wishlist){
    res.json({ products: [...wishlist.products] });
  }else{
    res.json({ message: 'Wishlist non esistente'});
  }
}
