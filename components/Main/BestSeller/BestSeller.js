import {useState} from 'react';

import Image from "next/image";
import classes from "./BestSeller.module.scss";
import Rating from '@mui/material/Rating';


function BestSeller(props) {

  const bestSellers = props.bestSeller;
  const bestSeller = bestSellers[0];

  return (
    <div className={classes.container}>
      <span className={classes.text}>Best Seller</span>
      <div className={classes["best-seller"]}>
        <div className={classes["title-container"]}>
        <span className={classes.title}>{bestSeller.brand}</span>
          <span className={classes.title}>{bestSeller.name}</span>
          <span className={classes.subtitle}>Compra ora</span>
        </div>
        <div className={classes['photo-container']}>
          <Image
            src="/headphone.png"
            alt="Picture of the author"
            layout='fill'

            className={classes.photo}
          />
        </div>
      </div>

      <div className={classes["scrolling-wrapper"]}>
        {bestSellers.slice(1).map((bestSeller, i) => (
          <div className={classes.card} key={i}>
            <Image
              src="/headphone.png"
              alt="Picture of the author"
              width={150}
              height={150}
            ></Image>
            <span className={classes.title}>{bestSeller.name}</span>
            <span className={classes.price}>€ {bestSeller.price}</span>
            <Rating className={classes.star} name="half-rating-read" defaultValue={2.4} precision={0.1} readOnly />
          </div>
        ))}
      </div>
    </div>
  );
}

export default BestSeller;
