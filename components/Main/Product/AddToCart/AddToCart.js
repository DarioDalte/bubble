import classes from "./AddToCart.module.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import Link from "next/link";

function AddToCart(props) {
  return (
    <>
      {!props.session ? (
        <Link href={"/login"} passHref>
          <IconButton>
            <FavoriteBorderIcon className={classes.heart} />
          </IconButton>
        </Link>
      ) : (
        <IconButton onClick={props.onHeartClick}>
          {props.heartClicked ? (
            <FavoriteIcon className={classes.heart} />
          ) : (
            <FavoriteBorderIcon className={classes.heart} />
          )}
        </IconButton>
      )}
      <span className={classes["btn"]}>Aggiungi al carrello</span>
    </>
  );
}

export default AddToCart;
