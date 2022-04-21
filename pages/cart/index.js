import style from "../../components/Main/Product/AddToCart/AddToCart.module.scss";
import classes from "./cart.module.scss";
import MyHead from "../../UI/MyHead/MyHead";
import BackArrow from "../../UI/BackArrow/BackArrow";
import { getSession, useSession } from "next-auth/client";
import { useEffect, useState } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import DeleteIcon from "@mui/icons-material/Delete";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { IconButton } from "@mui/material";
import Image from "next/image";

function Cart(props) {
  const [products, setProducts] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState();

  useEffect(() => {
    console.log("carico...");
    axios
      .post("/api/getCart", { email: props.session.user.email })
      .then((res) => {
        console.log(res.data);
        setProducts(res.data.products);
        setTotalPrice((res.data.totalPrice).toFixed(2));
        setIsLoading(false);
      }).catch(e =>{
        console.log(e);
      })
  }, []);

  const incrementQntHandler = () => {
    window.navigator.vibrate(100);
    props.setQuantity((prevQnt) => prevQnt + 1);
  };

  const decrementQntHandler = () => {
    if (props.quantity > 1) {
      window.navigator.vibrate(100);
      props.setQuantity((prevQnt) => prevQnt - 1);
    } else {
      window.navigator.vibrate(200);
    }
  };

  return (
    <>
      <MyHead title="Carello" />
      <BackArrow />
      {isLoading && "Carico..."}
      {!isLoading && (
        <>
          <div className={classes.container}>
            {products.map((product, i) => {
              return (
                <div className={classes["product-container"]} key={i}>
                  <div className={classes["image-container"]}>
                    <Image
                      src={`/${product.image}`}
                      alt={`Image of ${product.name}`}
                      layout={"responsive"}
                      width={100}
                      height={100}
                    />
                  </div>
                  <div className={classes["detail-container"]}>
                    <div
                      style={{ fontWeight: "600" }}
                    >{`${product.brand} ${product.name}`}</div>
                    <div>{`€ ${product.price}`}</div>
                    <div className={classes["icon-container"]}>
                      <div
                        className={`${style["qnt-container"]} ${classes["qnt-container"]}`}
                      >
                        <IconButton
                          className={style["qnt-icon-container"]}
                          onClick={decrementQntHandler}
                        >
                          <RemoveIcon className={style["qnt-icon"]} />
                        </IconButton>
                        {product.qnt}
                        <IconButton
                          className={style["qnt-icon-container"]}
                          onClick={incrementQntHandler}
                        >
                          <AddIcon className={style["qnt-icon"]} />
                        </IconButton>
                      </div>
                      <IconButton>
                        <DeleteIcon className={classes["delete-icon"]} />
                      </IconButton>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className={classes["bottom-nav"]}>
            <div className={classes["text-container"]}>
              <span>Totale prodotti </span>
              <span>€ {totalPrice}</span>
            </div>
            <span className={classes["btn"]}>
              Procedi con il checkout
              <ArrowForwardIosIcon />
            </span>
          </div>
        </>
      )}
    </>
  );
}

export default Cart;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session) {
    return {
      redirect: {
        destination: "../login",
        permanent: false,
      },
    };
  }
  return { props: { session: session } };
}
