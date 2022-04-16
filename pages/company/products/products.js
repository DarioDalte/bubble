import { useState } from "react";
import { getSession } from "next-auth/client";
import Image from "next/image";
import BackArrow from "../../../UI/BackArrow/BackArrow";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";

import classes from "./products.module.scss";
import Link from "next/link";
import axios from "axios";




function Products(props) {
  const [products, setProducts] = useState(props.products);
  const [deletedItem, setDeletedItem] = useState();
  const router = useRouter()

  function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
  }



  const deleteHandler = async (i) => {
    axios.post("/api/elimina_prodotto", { id: products[i]["_id"] });
    setDeletedItem(i);
    await delay(900);
    setDeletedItem(-1);
    setProducts((products) => products.filter((item, index) => index !== i));
  };

  return (
    <>
      <BackArrow path={props.prevUrl} />
      <h1 className={classes.title}>I miei prodotti</h1>

      <div className={classes.container}>
        {products.map((product, i) => (
          <div
            key={i}
            className={`${classes.card} ${
              deletedItem === i ? classes.deleted : ""
            }`}
          >
            <Image
              src={`/${product.image}`}
              alt={`Picture of ${product.name}`}
              width={150}
              height={150}
              layout="responsive"
            ></Image>
            <span className={classes.subtitle}>{product.name}</span>
            <div className={classes["icon-container"]}>
              <IconButton>
                <EditIcon className={classes["edit-icon"]} />
              </IconButton>
              <IconButton>
                <DeleteIcon
                  className={classes["delete-icon"]}
                  onClick={() => {
                    deleteHandler(i);
                  }}
                />
              </IconButton>
            </div>
          </div>
        ))}
        <div className={classes["add-container"]}>
          <Link href={"/company/add_product"} passHref>
            <IconButton className={classes.btn}>
              <AddIcon className={classes["add-icon"]} />
            </IconButton>
          </Link>
        </div>
      </div>
    </>
  );
}

export default Products;

export async function getServerSideProps(context) {
  const databaseConnection = require("../../api/middlewares/database.js");
  const session = await getSession({ req: context.req });

  if (!session || !session.user.image) {
    return {
      redirect: {
        destination: "../",
        permanent: false,
      },
    };
  }

  const client = await databaseConnection();
  await client.connect();
  const db = client.db();

  const user = await db
    .collection("companies")
    .findOne({ email: session.user.email });

  const products = await db
    .collection("products")
    .find({ brand: user["_id"] })
    .toArray();

  return {
    props: {
      session: session,
      prevUrl: context.req.headers.referer,
      products: JSON.parse(JSON.stringify(products)),
    },
  };
}
