import style from "../../components/Main/Product/AddToCart/AddToCart.module.scss";
import classes from "./wishlist.module.scss";
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

function Wishlist(props) {
  const [products, setProducts] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const isMobile = useMediaQuery("(max-width:62.5rem)");

  useEffect(() => {
    const obj = {
      email: props.session.user.email,
      name: "Wishlist",
    };
    axios
      .post("/api/getWishlist", obj)
      .then((res) => {
        const wishlist = res.data;
        if (wishlist.status) {
          setProducts(wishlist.products);
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
      <MyHead title="Wishlist" />
      <BackArrow />
      {isLoading && (
        <div className={classes.loading}>
          <CircularProgress className={classes.loading} />
        </div>
      )}
      {!isLoading && products && products.length != 0 && (
        <>
          <div className={classes.container}>
            <h3 className={classes.title}>La tua wishlist!</h3>
            <div className={classes.products}>
              {products.map((product, i) => {
                return (
                  <>
                    <div className={classes["product-container"]} key={i}>
                      <div className={classes["image-container"]}>
                        <Link href={`/product/${product.id}`} passHref>
                          <Image
                            src={`/${product.image}`}
                            alt={`Image of ${product.name}`}
                            layout={"responsive"}
                            width={100}
                            height={100}
                          />
                        </Link>
                      </div>
                      <div className={classes["detail-container"]}>
                        <div
                          style={{ fontWeight: "600", fontSize: "1.1rem" }}
                        >{`${product.brand} ${product.name}`}</div>
                        <div className={classes["delete-icon-container"]}>
                          <div>€ {product.price}</div>
                          <IconButton
                            onClick={() => {

                              window.navigator.vibrate(100);
                              const productsClone = JSON.parse(
                                JSON.stringify(products)
                              );

                              productsClone.splice(i, 1);

                              setProducts(productsClone);
                              const obj = {
                                id: product.id,
                                email: props.session.user.email,
                                name: "Wishlist",
                              };

                              axios
                                .post("/api/elimina_product_wishlist", obj)
                                .then((res) => {
                                  // console.log(res);
                                });
                            }}
                          >
                            <DeleteIcon className={classes["delete-icon"]} />
                          </IconButton>
                        </div>
                      </div>
                    </div>
                    <Divider />
                  </>
                );
              })}
            </div>
          </div>
        </>
      )}

      {(!isLoading && !products) ||
        (products && products.length === 0 && (
          <div className={classes.empty}>La tua wishlist è vuota!</div>
        ))}
    </>
  );
}

export default Wishlist;

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
