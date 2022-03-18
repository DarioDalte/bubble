import classes from "./Main.module.scss";

import Carousel from "../Carousel/Carousel";
import Categories from "../Categories/Categories";
import BestSeller from "./BestSeller/BestSeller";

function Main() {
  return (
    <div className={classes.container}>
      <Carousel />
      <Categories classes={classes.categories} />
      <BestSeller/>
    </div>
  );
}

export default Main;
