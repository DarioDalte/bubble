import Image from "next/image";
import classes from "./BestSeller.module.scss";

import Card from "../../../UI/Card/Card";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import useMediaQuery from "@mui/material/useMediaQuery";
import Carousel from "../../../UI/Carousel/Carousel";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Link from "next/link";
import { useRouter } from "next/router";

function BestSeller(props) {
  const isMobile = useMediaQuery("(max-width:47rem)");
  let bestSeller;
  let bestSellers;

  bestSellers = props.bestSeller;
  bestSeller = bestSellers[0].prodotto;
  const router = useRouter();

  return (
    <div className={classes.container}>
      <span className={classes.text}>Best Seller</span>
      <div className={classes["best-seller"]}>
        <div className={classes["title-container"]}>
          <span className={classes.title}>{bestSeller.brand}</span>
          <span className={classes.title}>{bestSeller.name}</span>
          <Link
            href={{
              pathname: "/product/[id]",
              query: {
                id: bestSeller["_id"],
                prevPath: "/",
              },
            }}
            as={`/product/${bestSeller["_id"]}`}
            passHref
          >
            <div className={classes["subtitle-container"]}>
              <a className={classes.subtitle}>Compra ora</a>

              <ArrowForwardIcon className={classes.arrowIcon} />
            </div>
          </Link>
        </div>

        <Link
          href={{
            pathname: "/product/[id]",
            query: {
              id: bestSeller["_id"],
              prevPath: "/",
            },
          }}
          as={`/product/${bestSeller["_id"]}`}
          passHref
        >
          <a className={classes["photo-container"]}>
            <Image
              src={`/${bestSeller.image}`}
              alt="Picture of the Best Seller"
              layout="fill"
              className={classes.photo}
              priority
            />
          </a>
        </Link>
      </div>

      <Carousel>
        {bestSellers.slice(1).map((bestSeller, i) => (
          <Card
            key={i}
            id={bestSeller.prodotto["_id"]}
            className={!isMobile && classes["card-desktop"]}
            name={bestSeller.prodotto.name}
            price={bestSeller.prodotto.price}
            brand={bestSeller.prodotto.brand}
            star={bestSeller.star}
            path={`/${bestSeller.prodotto.image}`}
            prevPath={"/"}
          />
        ))}
      </Carousel>
    </div>
  );
}

export default BestSeller;
