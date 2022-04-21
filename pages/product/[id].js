import { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
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

function Product(props) {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
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
  const onHeartClick = () => {
    setHeartClicked((heartClicked) => !heartClicked);
  };

  useEffect(() => {
    axios.post("/api/single_product", { id: id }).then((res) => {
      setData(res.data);

      let arr = [];
      if (res.data.prodotto.varianti) {
        Object.keys(res.data.prodotto.varianti).map((key, index) => {
          arr.push({
            id: res.data.prodotto.varianti[key][0].id,
            type: key,
            name: res.data.prodotto.varianti[key][0].name,
            increase: 0,
          });
        });
      }

      if (res.data.recensioni.length != 0) {
        let ratingSomma = 0;
        let ratingNumber = res.data.recensioni.length;

        res.data.recensioni.map((review) => (ratingSomma += review.value));

        if (props.session) {
          for (let i = 0; i < res.data.recensioni.length; i++) {
            if (res.data.recensioni[i].email === props.session.user.email) {
              setMyReview(res.data.recensioni[i]);
              res.data.recensioni.splice(i, 1);
            }
          }
        }

        setRatingAverage((ratingSomma / ratingNumber).toFixed(1));
        setReviews(res.data.recensioni);
        setReviewNumber(parseInt(res.data.numero_recensioni));
      }
      setVariant(arr);
      setInitialPrice(res.data.prodotto.price);
      setPrice(parseFloat(res.data.prodotto.price));
      setIsLoading(false);
    });
  }, []);

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
        email: props.session.user.email,
        id_product: id,
      })
      .then((res) => {
        console.log(res);
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
      email: props.session.user.email,
      variant: productVariant,
      qnt: quantity,
    };

    console.log(obj);
    axios.post('/api/inserimento_carrello', obj).then((res) =>{
      console.log(res)
    })
  };

  return (
    <>
      <MyHead title={isLoading ? "Prodotto" : data.prodotto.name} />

      {/* <Header session={props.session} /> */}

      <div className={classes.header}>
        <BackArrow path={props.prevPath} classes={classes.backArrow} />
        <IconButton>
          <ShoppingCartOutlinedIcon
            className={`${classes.cart} ${isAdding ? classes.bump : ""}`}
          />
        </IconButton>
      </div>

      {isLoading && (
        <div className={classes.loading}>
          <CircularProgress className={classes.loading} />
        </div>
      )}
      {!isLoading && (
        <>
          <div className={classes.main}>
            <div className={classes["top-container"]}>
              <div className={classes["image-container"]}>
                <Image
                  src={`/${data.prodotto.image}`}
                  alt={`Image of ${data.prodotto.name}`}
                  layout={"responsive"}
                  width={100}
                  height={100}
                />
              </div>
              <div
                className={`${classes.product} ${
                  !data.prodotto.varianti && !isMobile && classes["empty"]
                }`}
              >
                <div>
                  <h2 className={classes.title}>
                    {data.prodotto.name.charAt(0).toUpperCase() +
                      data.prodotto.name.slice(1)}
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
                        <p>
                          {reviewNumber === 1 ? "Recensione" : "Recensioni"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                {isMobile && <ShopLine brand={data.prodotto.brand} />}
                {data.prodotto.varianti && isMobile && (
                  <MobileVariant
                    varianti={data.prodotto.varianti}
                    variant={variant}
                    initialPrice={initialPrice}
                    setVariant={setVariant}
                    setPrice={setPrice}
                  />
                )}
                {data.prodotto.varianti && !isMobile && (
                  <DesktopVariant
                    varianti={data.prodotto.varianti}
                    variant={variant}
                    initialPrice={initialPrice}
                    setVariant={setVariant}
                    setPrice={setPrice}
                  />
                )}
                {!data.prodotto.varianti && !isMobile && (
                  <div className={classes["btn-container"]}>
                    <AddToCart
                      session={props.session}
                      onHeartClick={onHeartClick}
                      heartClicked={heartClicked}
                      quantity={quantity}
                      setQuantity={setQuantity}
                      addToCartHandler={addToCartHandler}
                    />
                  </div>
                )}
              </div>
            </div>
            {data.prodotto.varianti && !isMobile && (
              <div
                style={{ margin: "4rem 0" }}
                className={classes["btn-container"]}
              >
                <AddToCart
                  session={props.session}
                  onHeartClick={onHeartClick}
                  heartClicked={heartClicked}
                  quantity={quantity}
                  setQuantity={setQuantity}
                  addToCartHandler={addToCartHandler}
                />
              </div>
            )}
            <div className={classes.container}>
              {!isMobile && <ShopLine brand={data.prodotto.brand} />}

              {!myReview && (
                <AddReview
                  setMyReview={setMyReview}
                  reviews={reviews}
                  session={props.session}
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
                    session={props.session}
                    onHeartClick={onHeartClick}
                    heartClicked={heartClicked}
                    quantity={quantity}
                    setQuantity={setQuantity}
                    addToCartHandler={addToCartHandler}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Product;

export async function getServerSideProps(ctx) {
  const session = await getSession({ req: ctx.req });
  return {
    props: {
      prevPath: ctx.req.headers.referer ? ctx.req.headers.referer : null,
      session: session,
    }, // will be passed to the page component as props
  };
}
