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
import { buildUrl } from "cloudinary-build-url";
import EditIcon from "@mui/icons-material/Edit";

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
import Characteristics from "../../components/Main/Product/Characteristics/Characteristics";
import RatingLine from "../../components/Main/Product/RatingLine/RatingLine";
import ThumbNail from "../../components/Main/Product/ThumbNail/ThumbNail";
import MobileCarousel from "../../components/Main/Product/MobileCarousel/MobileCarousel";

function Product(props) {
  const router = useRouter();
  const { id, prevPath } = router.query;
  const [data, setData] = useState();
  const [heartClicked, setHeartClicked] = useState(false);
  const [variant, setVariant] = useState({});
  const [initialPrice, setInitialPrice] = useState();
  const [price, setPrice] = useState(0);
  const isMobile = useMediaQuery("(max-width:62rem)");
  const [reviews, setReviews] = useState([]);
  const [ratingAverage, setRatingAverage] = useState(0);
  const [myReview, setMyReview] = useState();
  const [reviewNumber, setReviewNumber] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [cartJump, setCartJump] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [showBottomNav, setShowBottomNav] = useState(true);
  const [images, setImages] = useState([]);
  const dispatch = useDispatch();
  const [session, status] = useSession();
  const { loadedProduct } = props;
  const [selectedImage, setSelectedImage] = useState(0);
  const [url, setUrl] = useState("");

  // if (images.length != 0) {
  //   const tempUrl = buildUrl(images[selectedImage], {
  //     cloud: {
  //       cloudName: "bubblemarketplace",
  //     },
  //   });

  //   setUrl(tempUrl);
  // }

  // console.log(loadedProduct.prodotto.varianti['Colore'][0]['images'][0]);

  const onHeartClick = () => {
    setHeartClicked((heartClicked) => !heartClicked);
  };

  const wishlistProducts = useSelector((state) => state.wishlistProducts);
  useEffect(() => {
    if (loadedProduct.prodotto) {
      //!CONTROLLARE CON PRODOTTI SENZA VARIANTI
      setImages(loadedProduct.prodotto.varianti["Colore"][0].images);

      // setImages(loadedProduct.prodotto.varianti["Colore"][0].images);

      let obj = {};
      if (loadedProduct.prodotto.varianti) {
        Object.keys(loadedProduct.prodotto.varianti).map((key, index) => {
          if (key === "Colore") {
            obj[key] = {
              id: loadedProduct.prodotto.varianti[key][0].id,
              name: loadedProduct.prodotto.varianti[key][0].name,
              increase: 0,
              hex: loadedProduct.prodotto.varianti[key][0].hex,
              images: loadedProduct.prodotto.varianti[key][0].images,
            };
          } else {
            obj[key] = {
              id: loadedProduct.prodotto.varianti[key][0].id,
              name: loadedProduct.prodotto.varianti[key][0].name,
              increase: 0,
            };
          }
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
      setVariant(obj);
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
        if (wishlist.status === 1) {
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
        }
      });
    }
  }, [router.asPath]);

  useEffect(() => {
    if (variant["Colore"]) {
      setImages(variant["Colore"].images);
    }
  }, [variant["Colore"]]);

  const deleteReviewHandler = () => {
    let myReviewIndex;
    reviews.map((review, index) => {
      if (myReview.id_user === review.id_user) {
        myReviewIndex = index;
      }
    });

    const tempReviews = [...reviews];
    tempReviews.splice(myReviewIndex, 1);

    setMyReview("");
    if (reviewNumber - 1 != 0) {
      let ratingSomma = 0;
      tempReviews.map((review, index) => {
        ratingSomma += review.value;
      });
      setRatingAverage((ratingSomma / (reviewNumber - 1)).toFixed(1));
      setReviews(tempReviews);
    } else {
      setRatingAverage(0);
      setReviews([]);
    }
    axios
      .post("/api/elimina_recensione", {
        email: session.user.email,
        id_product: id,
      })
      .then((res) => {
        // console.log(res);
      });

    setReviewNumber((prevReviewNumber) => prevReviewNumber - 1);
  };

  const addToCartHandler = () => {
    setCartJump(true);
    setIsAdding(true);
    window.navigator.vibrate(100);

    setTimeout(() => {
      setCartJump(false);
    }, 300);

    const productVariant = {};

    Object.keys(variant).map((key) => {
      productVariant[key] = variant[key].id;
    });

    console.log(productVariant);

    const obj = {
      id: id,
      email: session.user.email,
      variant: productVariant,
      qnt: quantity,
    };

    axios.post("/api/insertIntoCart", obj).then((res) => {
      // console.log(res);
      setIsAdding(false);
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
              className={`${classes.cart} ${cartJump ? classes.bump : ""}`}
            />
          </IconButton>
        </Link>
      </div>

      <>
        <div className={classes.main}>
          <div className={classes["top-container"]}>
            {!isMobile && (
              <ThumbNail
                images={images}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            )}
            <div className={classes["image-container"]}>
              {!isMobile ? (
                <Image
                  // src={`/${loadedProduct.prodotto.image}`}
                  src={
                    images[selectedImage]
                      ? buildUrl(images[selectedImage], {
                          cloud: {
                            cloudName: "bubblemarketplace",
                          },
                        })
                      : "/temp"
                  }
                  alt={`Image of ${loadedProduct.prodotto.name}`}
                  layout={"fill"}
                  objectFit={"contain"}
                  priority
                />
              ) : (
                <MobileCarousel images={images} />
              )}
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
                  <RatingLine
                    reviewNumber={reviewNumber}
                    ratingAverage={ratingAverage}
                  />
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
                  price={price}
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
                    isAdding={isAdding}
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
                isAdding={isAdding}
              />
            </div>
          )}
          <div className={classes.container}>
            {!isMobile && <ShopLine brand={loadedProduct.prodotto.brand} />}

            <div className={classes.characteristicsContainer}>
              <Characteristics
                list={loadedProduct.prodotto.characteristics}
                variant={variant}
              />

              {!isMobile && <Divider orientation="vertical" flexItem="true" />}

              <AddReview
                setMyReview={setMyReview}
                reviews={reviews}
                session={session}
                id={id}
                setRatingAverage={setRatingAverage}
                setReviewNumber={setReviewNumber}
                setReviews={setReviews}
                reviewNumber={reviewNumber}
                ratingAverage={ratingAverage}
                myReview={myReview}
                isMobile={isMobile}
                onDelete={deleteReviewHandler}
                setShowBottomNav={setShowBottomNav}
              />
            </div>

            {!reviews.length == 0 ? (
              <div className={classes["rating-container"]}>
                <div className={classes["rating-number"]}>
                  <div className={classes["rating-left"]}>
                    Recensioni ({reviewNumber})
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: ".3rem",
                    }}
                  >
                    <StarIcon sx={{ color: "#faaf00" }} /> {ratingAverage}
                  </div>
                </div>

                {reviews.length == 1 && myReview && (
                  <p
                    style={{
                      textAlign: "center",
                      marginTop: "5rem",
                      fontWeight: "600",
                    }}
                  >
                    Solo tu hai recensito questo prodotto!
                  </p>
                )}

                {myReview && isMobile && (
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
                          <EditIcon
                            style={{ color: "#3669c9" }}
                            onClick={props.onChange}
                          />
                        </IconButton>
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
                  let displayedName = name + " " + surname[0] + ".";
                  if (recensione["id_user"] === "Utente eliminato") {
                    displayedName =
                      name +
                      " " +
                      surname.charAt(0).toUpperCase() +
                      surname.slice(1);
                  }

                  if (!session || recensione.email != session.user.email) {
                    return (
                      <div key={i} className={classes.review}>
                        <span className={classes.title}>
                          {displayedName} <Divider orientation="vertical" />
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
                  marginTop: "5rem",
                  fontWeight: "600",
                }}
              >
                Non ci sono recensioni per questo prodotto
              </p>
            )}

            {isMobile && showBottomNav && (
              <div className={classes["bottom-nav"]}>
                <AddToCart
                  session={session}
                  onHeartClick={onHeartClick}
                  heartClicked={heartClicked}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  addToCartHandler={addToCartHandler}
                  productId={loadedProduct.prodotto["_id"]}
                  isAdding={isAdding}
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
