import classes from "./Card.module.scss";
import { useState } from "react";

import Image from "next/image";

import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";

import { IconButton, Rating } from '@mui/material';

function Card(props) {
  const [heartClicked, setHeartClicked] = useState(false);

  const onHeartClick = () => {
    setHeartClicked((heartClicked) => !heartClicked);
  };
  return (
    <div className={`${classes.card} ${props.className}`}>
      <Image
        src={props.path}
        alt="Picture of the author"
        width={150}
        height={150}
        layout='responsive'
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
