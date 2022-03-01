import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";

import classes from "./Carousel.module.scss";

function myCarousel() {
  return (
    <Carousel showThumbs={false} showStatus={false} autoPlay={false} width={"100%"} className={classes.carousel}>
      <div className={classes.container}>
        <div className={classes.item}>
          <p className={classes.text}>Legend 1</p>
        </div>
      </div>
      <div>
        <img src="/parigi.jpg" />
        <p className="legeand">Legend 2</p>
      </div>
      <div>
        <img src="/parigi.jpg" />
        <p className="legend">Legend 3</p>
      </div>
    </Carousel>
  );
}

export default myCarousel;
