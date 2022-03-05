import classes from "./Main.module.scss";

import Carousel from "../Carousel/Carousel";
import Categories from "../Categories/Categories";

function Main() {
  return (
    <div className={classes.container}>
      <Carousel />
      <Categories classes={classes.categories}/>
    </div>

  );
}

export default Main;
