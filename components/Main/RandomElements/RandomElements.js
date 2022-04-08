import Card from "../../../UI/Card/Card";
import Carousel from "../../../UI/Carousel/Carousel";
import classes from "./RandomElements.module.scss";

import useMediaQuery from "@mui/material/useMediaQuery";

const RandomElements = (props) => {
  const isMobile = useMediaQuery("(max-width:47rem)");

  return (
    <div className={classes.container}>
      {props.randomElements.map((category, i) => (
        <div key={i} className={classes["category-container"]}>
          <span className={classes.text}>{category.categoria}</span>
          <Carousel isMobile={isMobile}>
            {category.prodotti.map((element, i) => {
              return (
                <Card
                  className={!isMobile && classes["card-desktop"]}
                  key={i}
                  name={element.name}
                  price={element.price}
                  brand={element.brand}
                  star={0}
                  path={"/galaxybuds.webp"}
                />
              );
            })}
          </Carousel>
        </div>
      ))}
    </div>
  );
};

export default RandomElements;
