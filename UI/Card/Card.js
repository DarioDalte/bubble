import classes from "./Card.module.scss";
import { useEffect, useState } from "react";

import Image from "next/image";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useSelector, useDispatch } from "react-redux";
import { IconButton, Rating } from "@mui/material";
import { useSession } from "next-auth/client";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

function Card(props) {
  const [heartClicked, setHeartClicked] = useState(false);
  const dispatch = useDispatch();
  const wishlistProducts = useSelector((state) => state.wishlistProducts);
  const [session, status] = useSession();

  const onHeartClick = () => {
    setHeartClicked((heartClicked) => !heartClicked);
  };
  const router = useRouter();

  useEffect(() => {
    if (wishlistProducts) {
      if (wishlistProducts.includes(props.id)) {
        setHeartClicked(true);
      } else {
        setHeartClicked(false);
      }
    }
    console.log("fuori ");

    //TODO: SCHIFO, DA CAMBIARE
    if (session) {
      console.log("aooo si sess");
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

        if (wishlistIds.includes(props.id)) {
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

  return (
    <div className={`${classes.card} ${props.className}`}>
      {props.path && props.id ? (
        <Link
          href={{
            pathname: "/product/[id]",
            query: {
              id: props.id,
              prevPath: props.prevPath,
            },
          }}
          as={`/product/${props.id}`}
          passHref
        >
          <a>
            <Image
              src={props.path}
              alt={`Picture of ${props.name}`}
              width={150}
              height={150}
              layout="responsive"
            />
          </a>
        </Link>
      ) : (
        <Image
          src={props.path}
          alt={`Picture of ${props.name}`}
          width={150}
          height={150}
          layout="responsive"
        />
      )}
      <div className={classes.container}>
        <span className={classes.title}>{props.name}</span>
        <span className={classes.subtitle}>{props.brand}</span>
        <span className={classes.price}>{"€" + props.price}</span>
        <div className={classes.footer}>
          {
            <Rating
              className={classes.star}
              name="half-rating-read"
              value={props.star ? props.star : 0}
              precision={0.1}
              readOnly
            />
          }

          {!session ? (
            <Link href={"/login"} passHref>
              <IconButton>
                <FavoriteBorderIcon className={classes.heart} />
              </IconButton>
            </Link>
          ) : (
            <IconButton onClick={onHeartClick}>
              {heartClicked ? (
                <FavoriteIcon
                  className={classes.heart}
                  onClick={() => {
                    const obj = {
                      id: props.id,
                      email: session.user.email,
                      name: "Wishlist",
                    };

                    axios
                      .post("/api/elimina_product_wishlist", obj)
                      .then((res) => {
                        // console.log(res);
                      });
                  }}
                />
              ) : (
                <FavoriteBorderIcon
                  className={classes.heart}
                  onClick={() => {
                    const obj = {
                      id: props.id,
                      email: session.user.email,
                      name: "Wishlist",
                    };

                    axios.post("/api/inserisci_wishlist", obj).then((res) => {
                      // console.log(res);
                    });
                  }}
                />
              )}
            </IconButton>
          )}
        </div>
      </div>
    </div>
  );
}

export default Card;
