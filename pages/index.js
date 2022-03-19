import BottomNav from "../components/BottomNav/BottomNav";
import Header from "../components/Header/Header";
import Main from "../components/Main/Main";

export default function Home(props) {
  //console.log(props.products);
  //console.log(props.orders);
  return (
    <>
    
      <Header />
      <Main />
      <BottomNav />
    </>
  );
}

export async function getStaticProps() {
  const databaseConnection = require("./api/middlewares/database.js");

  const client = await databaseConnection(); //Mi connetto al db
  await client.connect();

  const db =  client.db();

  const productsCollection =  db.collection("products"); //Seleziono la collection
  const ordersCollection =  db.collection("orders"); //Seleziono la collection

  const products = await productsCollection.find({}).toArray();
  const orders = await ordersCollection.find({}).toArray();

  console.log(products);
  console.log(orders);
/** 
  SELECT COUNT(orders.id)
FROM products, orders
WHERE products.id = orders.cod_prod AND
GROUP by products*/


  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      orders: JSON.parse(JSON.stringify(orders))
    }, // will be passed to the page component as propsa
  };
}
