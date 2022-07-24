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
import { Divider, IconButton } from "@mui/material";
import Image from "next/image";
import useMediaQuery from "@mui/material/useMediaQuery";
import Link from "next/link";
import CircularProgress from "@mui/material/CircularProgress";
import { buildUrl } from "cloudinary-build-url";

function Cart(props) {
  const [products, setProducts] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [totalPrice, setTotalPrice] = useState();
  const [totalProducts, setTotalProducts] = useState();
  const isMobile = useMediaQuery("(max-width:62.5rem)");

  console.log(products);

  useEffect(() => {
    axios
      .post("/api/getCart", { email: props.session.user.email })
      .then((res) => {
        console.log(res.data);
        if (res.data.status) {
          setProducts(res.data.products);
          setTotalPrice(res.data.totalPrice.toFixed(2));
          setTotalProducts(res.data.totalProducts);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);

        console.log(e);
      });
  }, []);

  return (
    <>
      <MyHead title="Carello" />
      <BackArrow />
      {isLoading && (
        <div className={classes.loading}>
          <CircularProgress className={classes.loading} />
        </div>
      )}
      {!isLoading && products && products.length != 0 && (
        <>
          <div className={classes.container}>
            <h3 className={classes.title}>Il tuo carrello!</h3>
            <div className={classes.products}>
              {products.map((product, i) => {
                return (
                  <>
                    <div className={classes["product-container"]} key={i}>
                      <div className={classes["image-container"]}>
                        <Link href={`/product/${product.id}`} passHref>
                          <Image
                            src={
                              product.images
                                ? buildUrl(images[selectedImage], {
                                    cloud: {
                                      cloudName: "bubblemarketplace",
                                    },
                                  })
                                : buildUrl(
                                    product.variant["Colore"].images[0],
                                    {
                                      cloud: {
                                        cloudName: "bubblemarketplace",
                                      },
                                    }
                                  )
                            }
                            alt={`Image of ${product.name}`}
                            layout={"fill"}
                            objectFit={"contain"}
                          />
                        </Link>
                      </div>
                      <div className={classes["detail-container"]}>
                        <div
                          style={{ fontWeight: "600", fontSize: "1.1rem" }}
                        >{`${product.brand} ${product.name}`}</div>
                        <div>
                          {Object.keys(product.variant).map((key, i) => {
                            return (
                              <p key={i}>
                                <span style={{ fontWeight: "600" }}>
                                  {key}:{" "}
                                </span>
                                <span> {product.variant[key].name}</span>
                              </p>
                            );
                          })}
                        </div>
                        <div>{`€ ${product.price}`}</div>
                        <div className={classes["icon-container"]}>
                          <div
                            className={`${style["qnt-container"]} ${classes["qnt-container"]}`}
                          >
                            <IconButton
                              className={style["qnt-icon-container"]}
                              onClick={() => {
                                const productsClone = JSON.parse(
                                  JSON.stringify(products)
                                );
                                if (productsClone[i].qnt > 1) {
                                  window.navigator.vibrate(100);
                                  productsClone[i].qnt--;
                                  setProducts(productsClone);
                                } else {
                                  window.navigator.vibrate(200);
                                }
                              }}
                            >
                              <RemoveIcon className={style["qnt-icon"]} />
                            </IconButton>
                            {product.qnt}
                            <IconButton
                              className={style["qnt-icon-container"]}
                              onClick={() => {
                                window.navigator.vibrate(100);

                                const productsClone = JSON.parse(
                                  JSON.stringify(products)
                                );

                                productsClone[i].qnt++;
                                setProducts(productsClone);
                              }}
                            >
                              <AddIcon className={style["qnt-icon"]} />
                            </IconButton>
                          </div>
                          <IconButton>
                            <DeleteIcon
                              className={classes["delete-icon"]}
                              onClick={() => {
                                window.navigator.vibrate(100);

                                setProducts(productsClone);
                                const obj = {
                                  email: props.session.user.email,
                                  id: product.id,
                                  variant: product.variant,
                                };

                                axios
                                  .post("/api/deleteFromCart", obj)
                                  .then((res) => {
                                    // console.log(res);
                                  });

                                const productsClone = JSON.parse(
                                  JSON.stringify(products)
                                );

                                productsClone.splice(i, 1);
                                setProducts(productsClone);
                                let myTotal = totalProducts;
                                myTotal = myTotal - 1;

                                let myTotalPrice = totalPrice;
                                myTotalPrice -= product.price;

                                setTotalPrice(
                                  parseFloat(myTotalPrice).toFixed(2)
                                );
                                setTotalProducts(myTotal);
                              }}
                            />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                    <Divider />
                  </>
                );
              })}
            </div>
            {!isMobile && products && products.length != 0 && (
              <div className={classes.checkout}>
                <div className={classes["text-container"]}>
                  <span>Num prodotti {totalProducts} </span>
                  <span>€ {totalPrice}</span>
                </div>
                <span className={classes["btn"]}>
                  Procedi con l&apos;ordine
                  <ArrowForwardIosIcon className={classes["icon"]} />
                </span>
              </div>
            )}
          </div>
          {isMobile && products && products.length != 0 && (
            <div className={classes["bottom-nav-container"]}>
              <div className={classes["bottom-nav"]}>
                <div className={classes["text-container"]}>
                  <span>Num prodotti {totalProducts} </span>
                  <span>€ {totalPrice}</span>
                </div>
                <span className={classes["btn"]}>
                  Procedi con l&apos;ordine
                  <ArrowForwardIosIcon />
                </span>
              </div>
            </div>
          )}
        </>
      )}

      {(!isLoading && !products) ||
        (products && products.length === 0 && (
          <div className={classes.empty}>Il tuo carrello è vuoto!</div>
        ))}
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
