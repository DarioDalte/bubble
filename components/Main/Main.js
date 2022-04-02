import classes from "./Main.module.scss";

import Carousel from "./Carousel/Carousel";
import Categories from "./Categories/Categories";
import BestSeller from "./BestSeller/BestSeller";
import RandomElements from "./RandomElements/RandomElements";

function Main(props) {

  return (
    <div className={classes.container}>
      <Carousel />
      <Categories classes={classes.categories} />
      <BestSeller bestSeller={props.bestSeller}/>
      <RandomElements randomElements={props.randomElements}/>
    </div>
  );
}

export default Main;
