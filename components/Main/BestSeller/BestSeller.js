import Image from "next/image";
import classes from "./BestSeller.module.scss";

import Card from "../../../UI/Card/Card";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import useMediaQuery from "@mui/material/useMediaQuery";
import Carousel from "../../../UI/Carousel/Carousel";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";

function BestSeller(props) {
  const isMobile = useMediaQuery("(max-width:47rem)");
  let bestSeller;
  const loadingContent = [];
  let bestSellers;

  bestSellers = props.bestSeller;
  bestSeller = bestSellers[0].prodotto;

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
            <Link
              href={props.isLoading ? "/" : `/product/${bestSeller["_id"]}`}
            >
              <a className={classes.subtitle}>Compra ora</a>
            </Link>
            <ArrowForwardIcon className={classes.arrowIcon} />
          </div>
        </div>
        <div className={classes["photo-container"]}>
          {!props.isLoading ? (
            <Link href={`/product/${bestSeller["_id"]}`} passHref>
              <Image
                src={`/${bestSeller.image}`}
                alt="Picture of the Best Seller"
                layout="fill"
                className={classes.photo}
              />
            </Link>
          ) : (
            <SkeletonTheme
              baseColor="#5294e0"
              highlightColor="#96c7ff"
              borderRadius="0.5rem"
              duration={3}
            >
              <Skeleton height="100%" containerClassName="avatar-skeleton" />
            </SkeletonTheme>
          )}
        </div>
      </div>

      {!props.isLoading ? (
        <Carousel>
          {bestSellers.slice(1).map((bestSeller, i) => (
            <Card
              key={i}
              id={bestSeller.prodotto["_id"]}
              className={!isMobile && classes["card-desktop"]}
              name={bestSeller.prodotto.name}
              price={bestSeller.prodotto.price}
              brand={bestSeller.prodotto.brand}
              star={bestSeller.prodotto.star}
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
