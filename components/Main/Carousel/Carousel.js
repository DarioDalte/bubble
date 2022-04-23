import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

import classes from "./Carousel.module.scss";
import Image from "next/image";

function myCarousel() {
  return (
    <Carousel
      infiniteLoop={true}
      showThumbs={false}
      showStatus={false}
      autoPlay={true}
      className={classes.carousel}
      interval={6000}
    >
      <div className={classes.container}>
        <div className={classes["left-item"]}>
          <p className={classes.text}>Sconti di Pasqua!</p>
        </div>
        <div className={classes.background}>
          <Image src="/tizia.png" alt="Picture" layout="fill" />
        </div>
      </div>

      <div className={`${classes.container} ${classes["left-container"]}`}>
        <div className={classes["right-item"]}>
          <p className={classes.text}>Sconti di pasqua!</p>
        </div>
        <div className={classes["background-left"]}>
          <Image src="/tizio.png" alt="Picture" layout="fill" />
        </div>
      </div>
    </Carousel>
  );
}

export default myCarousel;
