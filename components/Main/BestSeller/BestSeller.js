import Image from "next/image";
import classes from "./BestSeller.module.scss";

import Card from "../../../UI/Card/Card";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
          <div className={classes["subtitle-container"]}>
            <span className={classes.subtitle}>Compra ora</span>
            <ArrowForwardIcon className={classes.arrowIcon} />
          </div>
        </div>
        <div className={classes["photo-container"]}>
          <Image
            src="/headphone.png"
            alt="Picture of the author"
            layout="fill"
            className={classes.photo}
          />
        </div>
      </div>

      <div className={classes["scrolling-wrapper"]}>
        {bestSellers.slice(1).map((bestSeller, i) => (
          <Card
            className={classes.card}
            key={i}
            name={bestSeller.name}
            price={bestSeller.price}
            brand={bestSeller.brand}
            star={bestSeller.star}
            path={"/galaxybuds.webp"}
          />
        ))}
      </div>
      <div className={classes.random}>
        Elletrodomestici
        <div className={`${classes['scrolling-wrapper']} ${classes['wrapper-random']}`}>
          {bestSellers.slice(1).map((bestSeller, i) => (
            <Card
              className={classes.card}
              key={i}
              name={bestSeller.name}
              price={bestSeller.price}
              brand={bestSeller.brand}
              star={bestSeller.star}
              path={"/galaxybuds.webp"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default BestSeller;
