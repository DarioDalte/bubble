import { useEffect, useState } from "react";
import { getSession } from "next-auth/client";
import { useRouter } from "next/router";
import Image from "next/image";
import classes from "./product.module.scss";
import BackArrow from "../../UI/BackArrow/BackArrow";
import StarIcon from "@mui/icons-material/Star";
import axios from "axios";
import { Divider } from "@mui/material";
import GppGoodIcon from "@mui/icons-material/GppGood";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import Rating from "@mui/material/Rating";
import Link from "next/link";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";

function Product(props) {
  const router = useRouter();
  const { id } = router.query;
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState();
  const [heartClicked, setHeartClicked] = useState(false);

  const onHeartClick = () => {
    setHeartClicked((heartClicked) => !heartClicked);
  };

  useEffect(() => {
    axios.post("/api/single_product", { id: id }).then((res) => {
      console.log(res.data);
      setData(res.data);
      setIsLoading(false);
    });
  }, []);

  return (
    <>
      <BackArrow />
      {!isLoading && (
        <>
          <div className={classes["image-container"]}>
            <Image
              src={`/${data.prodotto.image}`}
              alt={`Image of ${data.prodotto.name}`}
              layout={"responsive"}
              width={"100%"}
              height={"100%"}
            />
          </div>
          <div className={classes.container}>
            <h2 className={classes.title}>{data.prodotto.name}</h2>
            <div className={classes["price-rating-container"]}>
              <p className={classes.price}>€ {data.prodotto.price}</p>
              <div className={classes.rating}>
                <div className={classes["rating-average"]}>
                  <StarIcon sx={{ color: "#faaf00" }} /> {data.star}
                </div>
                <div className={classes["rating-number"]}>
                  <p>{data.numero_recensioni}</p>
                  <p>
                    {data.numero_recensioni === 1 ? "Recensione" : "Recensioni"}
                  </p>
                </div>
              </div>
            </div>
            <Divider sx={{ margin: "1rem 0" }} />
            <div
              className={classes["middle-container"]}
              onClick={() => {
                router.push(`/products/${data.prodotto.brand}`);
              }}
            >
              <div className={classes["shop-left"]}>
                <h4 className={classes.title}>{data.prodotto.brand}</h4>
                <div className={classes["shop-container"]}>
                  <p>Negozio ufficiale</p>{" "}
                  <GppGoodIcon sx={{ color: "#3669c9" }} />
                </div>
              </div>
              <div className={classes["shop-right"]}>
                <ArrowForwardIosIcon sx={{ color: "#3669c9" }} />
              </div>
            </div>

            <Divider sx={{ margin: "1rem 0" }} />
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
                      <h4 className={classes.title}>{name} {surname[0]}.</h4>
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
              <p style={{textAlign: 'center', marginTop: '3rem', fontWeight: '600'}}>Non ci sono recensioni per questo prodotto</p>
            )}

            <div className={classes["bottom-nav"]}>
              {!props.session ? (
                <Link href={"/login"} passHref>
                  <IconButton>
                    <FavoriteBorderIcon className={classes.heart} />
                  </IconButton>
                </Link>
              ) : (
                !props.isLoading && (
                  <IconButton onClick={onHeartClick}>
                    {heartClicked ? (
                      <FavoriteIcon className={classes.heart} />
                    ) : (
                      <FavoriteBorderIcon className={classes.heart} />
                    )}
                  </IconButton>
                )
              )}
              <span className={classes["btn"]}>Aggiungi al carrello</span>
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
      session: session,
    }, // will be passed to the page component as props
  };
}
