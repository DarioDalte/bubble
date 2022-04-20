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
  const [price, setPrice] = useState();
  const isMobile = useMediaQuery("(max-width:62rem)");

  const onHeartClick = () => {
    setHeartClicked((heartClicked) => !heartClicked);
  };

  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  useEffect(() => {
    axios.post("/api/single_product", { id: id }).then((res) => {
      setData(res.data);
      setIsLoading(false);

      let arr = [];
      if (res.data.prodotto.varianti) {
        Object.keys(res.data.prodotto.varianti).map((key, index) => {
          arr.push({
            type: key,
            name: res.data.prodotto.varianti[key][0].name,
            increase: 0,
          });
        });
      }
      setVariant(arr);
      setInitialPrice(res.data.prodotto.price);
      setPrice(res.data.prodotto.price);
    });
  }, []);

  return (
    <>
      <MyHead title={isLoading ? "Prodotto" : data.prodotto.name} />

      {/* <Header session={props.session} /> */}

      <BackArrow path={props.prevPath} sx={{}} />

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
                  <h2 className={classes.title}>{data.prodotto.name}</h2>
                  <div className={classes["price-rating-container"]}>
                    <p className={classes.price}>
                      € {price && price.toFixed(2)}
                    </p>
                    <div className={classes.rating}>
                      <div className={classes["rating-average"]}>
                        <StarIcon sx={{ color: "#faaf00" }} /> {data.star}
                      </div>
                      <div className={classes["rating-number"]}>
                        <p>{data.numero_recensioni}</p>
                        <p>
                          {data.numero_recensioni === 1
                            ? "Recensione"
                            : "Recensioni"}
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
                />
              </div>
            )}
            <div className={classes.container}>
              {!isMobile && <ShopLine brand={data.prodotto.brand} />}

              <AddReview />

              

              {!data.recensioni.length == 0 ? (
                <div className={classes["rating-container"]}>
                  <div className={classes["rating-number"]}>
                    <div className={classes["rating-left"]}>
                      Recensioni ({data.numero_recensioni})
                    </div>
                    <div className={classes["rating-average"]}>
                      <StarIcon sx={{ color: "#faaf00" }} /> {data.star}
                    </div>
                  </div>

                  {data.recensioni.map((recensione, i) => {
                    const [name, surname] = recensione["id_user"].split(" ");
                    return (
                      <div key={i} className={classes.review}>
                        <h4 className={classes.title}>
                          {name} {surname[0]}.
                        </h4>
                        <Rating
                          name="read-only"
                          value={recensione.value}
                          readOnly
                          className={classes.rating}
                        />
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
