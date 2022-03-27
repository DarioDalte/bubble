import classes from "./Card.module.scss";
import { useState } from "react";

import Rating from "@mui/material/Rating";
import Image from "next/image";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconButton from "@mui/material/IconButton";

function Card(props) {
  const [heartClicked, setHeartClicked] = useState(false);

  const onHeartClick = () => {
    setHeartClicked((heartClicked) => !heartClicked);
  };
  return (
    <div className={classes.card}>
      <Image
        src={props.path}
        alt="Picture of the author"
        width={120}
        height={150}
      ></Image>
      <div className={classes.container}>
        <span className={classes.title}>{props.name}</span>
        <span className={classes.subtitle}>{props.brand}</span>
        <span className={classes.price}>€ {props.price}</span>
        <div className={classes.footer}>
          <Rating
            className={classes.star}
            name="half-rating-read"
            defaultValue={props.star}
            precision={0.1}
            readOnly
          />

          <IconButton onClick={onHeartClick}>
            {heartClicked ? (
              <FavoriteIcon className={classes.heart} />
            ) : (
              <FavoriteBorderIcon className={classes.heart} />
            )}
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default Card;
