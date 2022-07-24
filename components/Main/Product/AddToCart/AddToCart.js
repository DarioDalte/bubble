import classes from "./AddToCart.module.scss";

import { useState } from "react";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
import CircularProgress from "@mui/material/CircularProgress";

function AddToCart(props) {
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
      <div className={classes.container}>
        <div className={classes["qnt-container"]}>
          <IconButton
            className={classes["qnt-icon-container"]}
            onClick={decrementQntHandler}
          >
            <RemoveIcon className={classes["qnt-icon"]} />
          </IconButton>
          {props.quantity}
          <IconButton
            className={classes["qnt-icon-container"]}
            onClick={incrementQntHandler}
          >
            <AddIcon className={classes["qnt-icon"]} />
          </IconButton>
        </div>
        <div className={classes["heart-btn-container"]}>
          {!props.session ? (
            <>
              <Link href={"/login"} passHref>
                <IconButton>
                  <FavoriteBorderIcon className={classes.heart} />
                </IconButton>
              </Link>
              <Link href={"/login"}>
                <a className={classes["btn"]}>Aggiungi al carrello</a>
              </Link>
            </>
          ) : (
            <>
              <IconButton onClick={props.onHeartClick}>
                {props.heartClicked ? (
                  <FavoriteIcon
                    className={classes.heart}
                    onClick={() => {
                      const obj = {
                        id: props.productId,
                        email: props.session.user.email,
                        name: "Wishlist",
                      };

                      axios.post("/api/deleteFromWishList", obj).then((res) => {
                        // console.log(res);
                      });
                    }}
                  />
                ) : (
                  <FavoriteBorderIcon
                    className={classes.heart}
                    onClick={() => {
                      const obj = {
                        id: props.productId,
                        email: props.session.user.email,
                        name: "Wishlist",
                      };

                      axios.post("/api/insertIntoWishList", obj).then((res) => {
                        // console.log(res);
                      });
                    }}
                  />
                )}
              </IconButton>

              <span
                className={classes["btn"]}
                onClick={!props.isAdding ? props.addToCartHandler : () => {}}
              >
                {!props.isAdding ? (
                  "Aggiungi al carrello"
                ) : (
                  <CircularProgress size={35} style={{ color: "inherit" }} />
                )}
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AddToCart;
