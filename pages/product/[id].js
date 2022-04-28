import { useEffect, useState } from "react";
import { getSession, useSession } from "next-auth/client";

import { useRouter } from "next/router";
import Image from "next/image";
import classes from "./product.module.scss";
import BackArrow from "../../UI/BackArrow/BackArrow";
import Loading from "../../UI/Loading/Loading";
import MyHead from "../../UI/MyHead/MyHead";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { Divider } from "@mui/material";
import Header from "../../components/Header/Header";
import DeleteIcon from "@mui/icons-material/Delete";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Rating from "@mui/material/Rating";
import Link from "next/link";

import CircularProgress from "@mui/material/CircularProgress";
import AddReview from "../../components/Main/Product/AddReview/AddReview";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import Head from "next/head";
import useMediaQuery from "@mui/material/useMediaQuery";
import ShopLine from "../../components/Main/Product/ShopLine/ShopLine";
import MobileVariant from "../../components/Main/Product/MobileVariant/MobileVariant";
import DesktopVariant from "../../components/Main/Product/DesktopVariant/DesktopVariant";
import AddToCart from "../../components/Main/Product/AddToCart/AddToCart";
import { useSelector, useDispatch } from "react-redux";

function Product(props) {
  const router = useRouter();
  const { id, prevPath } = router.query;
  const [data, setData] = useState();
  const [heartClicked, setHeartClicked] = useState(false);
  const [variant, setVariant] = useState([]);
  const [initialPrice, setInitialPrice] = useState();
  const [price, setPrice] = useState(0);
  const isMobile = useMediaQuery("(max-width:62rem)");
  const [reviews, setReviews] = useState([]);
  const [ratingAverage, setRatingAverage] = useState(0);
  const [myReview, setMyReview] = useState();
  const [reviewNumber, setReviewNumber] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const dispatch = useDispatch();
  const [session, status] = useSession();
  const { loadedProduct } = props;

  const onHeartClick = () => {
    setHeartClicked((heartClicked) => !heartClicked);
  };

  const wishlistProducts = useSelector((state) => state.wishlistProducts);
  useEffect(() => {
    if (loadedProduct.prodotto) {
      let arr = [];
      if (loadedProduct.prodotto.varianti) {
        Object.keys(loadedProduct.prodotto.varianti).map((key, index) => {
          arr.push({
            id: loadedProduct.prodotto.varianti[key][0].id,
            type: key,
            name: loadedProduct.prodotto.varianti[key][0].name,
            increase: 0,
          });
        });
      }

      if (loadedProduct.recensioni.length != 0) {
        let ratingSomma = 0;
        let ratingNumber = loadedProduct.recensioni.length;

        loadedProduct.recensioni.map((review) => (ratingSomma += review.value));

        if (session) {
          for (let i = 0; i < loadedProduct.recensioni.length; i++) {
            if (loadedProduct.recensioni[i].email === session.user.email) {
              setMyReview(loadedProduct.recensioni[i]);
            }
          }
        }

        setRatingAverage((ratingSomma / ratingNumber).toFixed(1));
        setReviews(loadedProduct.recensioni);
        setReviewNumber(parseInt(loadedProduct.numero_recensioni));
      }
      setVariant(arr);
      setInitialPrice(loadedProduct.prodotto.price);
      setPrice(parseFloat(loadedProduct.prodotto.price));
    }
  }, [session, router.asPath]);

  useEffect(() => {
    if (wishlistProducts) {
      if (wishlistProducts.includes(id)) {
        setHeartClicked(true);
      } else {
        setHeartClicked(false);
      }
    }
    if (session) {
      const obj = {
        email: session.user.email,
        name: "Wishlist",
      };
      axios.post("/api/getWishlist", obj).then((res) => {
        const wishlist = res.data;
        const wishlistIds = [];
        wishlist.products.map((product) => {
          wishlistIds.push(product.id);
        });

        if (wishlistIds.includes(id)) {
          setHeartClicked(true);
        } else {
          setHeartClicked(false);
        }

        if (wishlist.status) {
          dispatch({
            type: "ADD_WISHLISTPRODUCTS",
            wishlistProducts: wishlistIds,
          });
        }
      });
    }
  }, [router.asPath]);

  const deleteReviewHandler = () => {
    setReviewNumber((prevReviewNumber) => prevReviewNumber - 1);

    setMyReview("");
    if (reviews.length != 0) {
      let ratingSomma = 0;
      reviews.map((review) => {
        ratingSomma += review.value;
      });
      setRatingAverage((ratingSomma / reviews.length).toFixed(1));
    } else {
      setRatingAverage(0);
    }
    axios
      .post("/api/elimina_recensione", {
        email: session.user.email,
        id_product: id,
      })
      .then((res) => {
        // console.log(res);
      });
  };

  const addToCartHandler = () => {
    setIsAdding(true);
    window.navigator.vibrate(100);

    setTimeout(() => {
      setIsAdding(false);
    }, 300);

    const productVariant = {};
    variant.map((variant) => {
      productVariant[variant["type"]] = variant.id;
    });

    const obj = {
      id: id,
      email: session.user.email,
      variant: productVariant,
      qnt: quantity,
    };

    axios.post("/api/inserimento_carrello", obj).then((res) => {
      // console.log(res);
    });
  };

  return (
    <>
      <MyHead title={loadedProduct.prodotto.name} />

      {/* <Header session={session} /> */}

      <div className={classes.header}>
        <BackArrow path={prevPath} classes={classes.backArrow} />
        <Link href={session ? "/cart" : "/login"} passHref>
          <IconButton>
            <ShoppingCartOutlinedIcon
              className={`${classes.cart} ${isAdding ? classes.bump : ""}`}
            />
          </IconButton>
        </Link>
      </div>

      <>
        <div className={classes.main}>
          <div className={classes["top-container"]}>
            <div className={classes["image-container"]}>
              <Image
                src={`/${loadedProduct.prodotto.image}`}
                alt={`Image of ${loadedProduct.prodotto.name}`}
                layout={"responsive"}
                width={100}
                height={100}
                priority
              />
            </div>
            <div
              className={`${classes.product} ${
                !loadedProduct.prodotto.varianti &&
                !isMobile &&
                classes["empty"]
              }`}
            >
              <div>
                <h2 className={classes.title}>
                  {loadedProduct.prodotto.name.charAt(0).toUpperCase() +
                    loadedProduct.prodotto.name.slice(1)}
                </h2>
                <div className={classes["price-rating-container"]}>
                  <p className={classes.price}>
                    € {parseFloat(price).toFixed(2)}
                  </p>
                  <div className={classes.rating}>
                    <div className={classes["rating-average"]}>
                      <StarIcon sx={{ color: "#faaf00" }} /> {ratingAverage}
                    </div>
                    <div className={classes["rating-number"]}>
                      <p>{reviewNumber}</p>
                      <p>{reviewNumber === 1 ? "Recensione" : "Recensioni"}</p>
                    </div>
                  </div>
                </div>
              </div>
              {isMobile && <ShopLine brand={loadedProduct.prodotto.brand} />}
              {loadedProduct.prodotto.varianti && isMobile && (
                <MobileVariant
                  varianti={loadedProduct.prodotto.varianti}
                  variant={variant}
                  initialPrice={initialPrice}
                  setVariant={setVariant}
                  setPrice={setPrice}
                />
              )}
              {loadedProduct.prodotto.varianti && !isMobile && (
                <DesktopVariant
                  varianti={loadedProduct.prodotto.varianti}
                  variant={variant}
                  initialPrice={initialPrice}
                  setVariant={setVariant}
                  setPrice={setPrice}
                />
              )}
              {!loadedProduct.prodotto.varianti && !isMobile && (
                <div className={classes["btn-container"]}>
                  <AddToCart
                    session={session}
                    onHeartClick={onHeartClick}
                    heartClicked={heartClicked}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    addToCartHandler={addToCartHandler}
                    productId={loadedProduct.prodotto["_id"]}
                  />
                </div>
              )}
            </div>
          </div>
          {loadedProduct.prodotto.varianti && !isMobile && (
            <div
              style={{ margin: "4rem 0" }}
              className={classes["btn-container"]}
            >
              <AddToCart
                session={session}
                onHeartClick={onHeartClick}
                heartClicked={heartClicked}
                quantity={quantity}
                setQuantity={setQuantity}
                addToCartHandler={addToCartHandler}
                productId={loadedProduct.prodotto["_id"]}
              />
            </div>
          )}
          <div className={classes.container}>
            {!isMobile && <ShopLine brand={loadedProduct.prodotto.brand} />}

            {!myReview && (
              <AddReview
                setMyReview={setMyReview}
                reviews={reviews}
                session={session}
                id={id}
                setRatingAverage={setRatingAverage}
                setReviewNumber={setReviewNumber}
              />
            )}

            {!reviews.length == 0 || myReview ? (
              <div className={classes["rating-container"]}>
                <div className={classes["rating-number"]}>
                  <div className={classes["rating-left"]}>
                    Recensioni ({reviewNumber})
                  </div>
                  <div className={classes["rating-average"]}>
                    <StarIcon sx={{ color: "#faaf00" }} /> {ratingAverage}
                  </div>
                </div>

                {myReview && (
                  <>
                    <div className={classes["my-reviw-container"]}>
                      <div className={classes.review}>
                        <span className={classes.title}>
                          {`${myReview["id_user"].split(" ")[0]} ${
                            myReview["id_user"].split(" ")[1]
                          }`}
                        </span>
                        <Rating
                          name="read-only"
                          value={myReview.value}
                          readOnly
                          className={classes.rating}
                        />
                        <span className={classes.subtitle}>
                          {myReview.title}
                        </span>
                        <p className={classes.text}>{myReview.text}</p>
                      </div>
                      <div className={classes["icon-container"]}>
                        <IconButton>
                          <DeleteIcon
                            className={classes["delete-icon"]}
                            onClick={deleteReviewHandler}
                          />
                        </IconButton>
                      </div>
                    </div>
                    <Divider sx={{ marginTop: "1rem" }} />
                  </>
                )}

                {reviews.map((recensione, i) => {
                  const [name, surname] = recensione["id_user"].split(" ");

                  if (!session || recensione.email != session.user.email) {
                    return (
                      <div key={i} className={classes.review}>
                        <span className={classes.title}>
                          {name} {surname[0]}.{" "}
                          <Divider orientation="vertical" />
                        </span>
                        <Rating
                          name="read-only"
                          value={recensione.value}
                          readOnly
                          className={classes.rating}
                        />
                        <span className={classes.subtitle}>
                          {recensione.title}
                        </span>
                        <p className={classes.text}>{recensione.text}</p>
                      </div>
                    );
                  }
                })}
              </div>
            ) : (
              <p
                style={{
                  textAlign: "center",
                  marginTop: "3rem",
                  fontWeight: "600",
                }}
              >
                Non ci sono recensioni per questo prodotto
              </p>
            )}

            {isMobile && (
              <div className={classes["bottom-nav"]}>
                <AddToCart
                  session={session}
                  onHeartClick={onHeartClick}
                  heartClicked={heartClicked}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  addToCartHandler={addToCartHandler}
                  productId={loadedProduct.prodotto["_id"]}
                />
              </div>
            )}
          </div>
        </div>
      </>
    </>
  );
}

export async function getStaticProps(context) {
  const databaseConnection = require("../api/middlewares/database.js");
  const getSingleProduct = require("../api/staticProps/getSingleProduct.js");

  const { params } = context;
  const productId = params.id;

  const client = await databaseConnection();
  await client.connect();
  const db = client.db();
  const product = await getSingleProduct(db, productId);

  client.close();

  return {
    props: {
      loadedProduct: JSON.parse(JSON.stringify(product)),
    },
    revalidate: 10,
  };
}

export async function getStaticPaths() {
  const databaseConnection = require("../api/middlewares/database.js");
  const client = await databaseConnection();
  await client.connect();
  const db = client.db();

  const products = await db.collection("products").find().toArray();
  const productIds = products.map((product) => {
    return {
      params: {
        id: product["_id"].toString().replace(/ObjectId\("(.*)"\)/, "$1"),
      },
    };
  });

  client.close();

  return {
    paths: productIds,
    fallback: false,
  };
}

export default Product;
