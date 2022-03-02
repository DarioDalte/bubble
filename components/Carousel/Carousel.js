import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

import classes from "./Carousel.module.scss";

function myCarousel() {
  return (
    <Carousel
      infiniteLoop={true}
      showThumbs={false}
      showStatus={false}
      autoPlay={true}
      className={classes.carousel}
    >
      <div
        className={classes.container}
        style={{ backgroundImage: `url('/parigi.jpg')` }}
      >
        <div className={classes["left-item"]}>
          <p className={classes.text}>Legend 1</p>
        </div>
      </div>

      <div
        className={`${classes.container} ${classes["left-container"]}`}
        style={{ backgroundImage: `url('/parigi.jpg')` }}
      >
        <div className={classes["right-item"]}>
          <p className={classes.text}>Legend 1</p>
        </div>
      </div>
    </Carousel>
  );
}

export default myCarousel;
