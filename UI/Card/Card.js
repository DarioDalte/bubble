import classes from "./Card.module.scss";
import { useEffect, useState, forwardRef } from "react";

import Image from "next/image";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useSelector, useDispatch } from "react-redux";
import { IconButton, Rating } from "@mui/material";
import Skeleton from "react-loading-skeleton";
import { useSession } from "next-auth/client";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";

const Card = forwardRef(function Card(props, ref) {
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
      }
    }
  }, [router.asPath]);

  const content = (
    <div className={`${classes.card} ${props.className}`}>
      {!props.isLoading ? (
        props.path && (
          <Image
            src={props.path}
            alt={`Picture of ${props.name}`}
            width={150}
            height={150}
            layout="responsive"
          ></Image>
        )
      ) : (
        <Skeleton height={150} width="100%" />
      )}
      <div className={classes.container}>
        <span className={classes.title}>
          {!props.isLoading ? (
            props.name
          ) : (
            <Skeleton width={"60%"} height={25} />
          )}
        </span>
        <span className={classes.subtitle}>
          {!props.isLoading ? (
            props.brand
          ) : (
            <Skeleton width={"40%"} height={15} />
          )}
        </span>
        <span className={classes.price}>
          {!props.isLoading ? "€" + props.price : <Skeleton width={"30%"} />}
        </span>
        <div className={classes.footer}>
          {!props.isLoading ? (
            <Rating
              className={classes.star}
              name="half-rating-read"
              value={props.star ? props.star : 0}
              precision={0.1}
              readOnly
            />
          ) : (
            <Skeleton width={130} />
          )}

          {!props.isLoading &&
            (!session ? (
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
                          console.log(res);
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
                        console.log(res);
                      });
                    }}
                  />
                )}
              </IconButton>
            ))}
        </div>
      </div>
    </div>
  );

  if (!props.id) {
    return <>{content}</>;
  }
  return (
    <Link href={`/product/${props.id}`} passHref>
      {content}
    </Link>
  );
});

export default Card;
