import classes from "./AddToCart.module.scss";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { IconButton } from "@mui/material";
import Link from "next/link";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import axios from "axios";
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
                      const obj ={
                        id: props.productId,
                        email: props.session.user.email,
                        name: 'Wishlist'

                      }
                      
                      axios.post('/api/elimina_product_wishlist', obj).then(res=>{
                        // console.log(res);
                      })
                    }}
                  />
                ) : (
                  <FavoriteBorderIcon
                    className={classes.heart}
                    onClick={() => {
                      const obj ={
                        id: props.productId,
                        email: props.session.user.email,
                        name: 'Wishlist'

                      }
                      
                      axios.post('/api/inserisci_wishlist', obj).then(res=>{
                        // console.log(res);
                      })
                    }}
                  />
                )}
              </IconButton>
              <span className={classes["btn"]} onClick={props.addToCartHandler}>
                Aggiungi al carrello
              </span>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default AddToCart;
