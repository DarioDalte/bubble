import Image from "next/image";
import classes from "./BestSeller.module.scss";

import Card from "../../../UI/Card/Card";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import useMediaQuery from "@mui/material/useMediaQuery";
import Carousel from "../../../UI/Carousel/Carousel";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function BestSeller(props) {
  const isMobile = useMediaQuery("(max-width:47rem)");
  let bestSeller;
  const loadingContent = [];
  let bestSellers;
  if (!props.isLoading) {
    console.log(props.bestSeller);
    bestSellers = props.bestSeller;
    bestSeller = bestSellers[0].prodotto;
    
  } else {
    for (let i = 0; i < 5; i++) {
      loadingContent.push(
        <Card
          className={!isMobile && classes["card-desktop"]}
          key={i}
          isLoading={props.isLoading}
        />
      );
    }
  }

  return (
    <div className={classes.container}>
      <span className={classes.text}>Best Seller</span>
      <div className={classes["best-seller"]}>
        <div className={classes["title-container"]}>
          {!props.isLoading ? (
            <>
              <span className={classes.title}>{bestSeller.brand}</span>
              <span className={classes.title}>{bestSeller.name}</span>
            </>
          ) : (
            <SkeletonTheme
              baseColor="#5294e0"
              highlightColor="#96c7ff"
              borderRadius="0.5rem"
              duration={3}
            >
              <Skeleton width={50} count={2} height={12} />
            </SkeletonTheme>
          )}

          <div className={classes["subtitle-container"]}>
            <span className={classes.subtitle}>Compra ora</span>
            <ArrowForwardIcon className={classes.arrowIcon} />
          </div>
        </div>
        <div className={classes["photo-container"]}>
          {!props.isLoading ? (
            <Image
              src={`/${bestSeller.image}`}
              alt="Picture of the Best Seller"
              layout="fill"
              className={classes.photo}
            />
          ) : (
            <SkeletonTheme
              baseColor="#5294e0"
              highlightColor="#96c7ff"
              borderRadius="0.5rem"
              duration={3}
            >
              <Skeleton
                
                height="100%"
                containerClassName="avatar-skeleton"
              />
            </SkeletonTheme>
          )}
        </div>
      </div>

      {/* //TODO: ADD .charAt(0).toUpperCase() + props.name.slice(1) */}
      {!props.isLoading ? (
        <Carousel>
          {bestSellers.slice(1).map((bestSeller, i) => (
            <Card
              className={!isMobile && classes["card-desktop"]}
              key={i}
              name={bestSeller.prodotto.name}
              price={bestSeller.prodotto.price}
              brand={bestSeller.prodotto.brand}
              star={bestSeller.star}
              path={`/${bestSeller.prodotto.image}`}
            />
          ))}
        </Carousel>
      ) : (
        <Carousel>{loadingContent}</Carousel>
      )}
    </div>
  );
}

export default BestSeller;
