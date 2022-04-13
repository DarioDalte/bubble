import Card from "../../../UI/Card/Card";
import Carousel from "../../../UI/Carousel/Carousel";
import classes from "./RandomElements.module.scss";

import useMediaQuery from "@mui/material/useMediaQuery";

const RandomElements = (props) => {
  const isMobile = useMediaQuery("(max-width:47rem)");
  console.log(props.randomElements);
  return (
    <div className={classes.container}>
      {props.randomElements && props.randomElements.elements.map((category, i) => (
        <div key={i} className={classes["category-container"]}>
          <span className={classes.text}>{category.categoria}</span>
          <Carousel isMobile={isMobile}>
            {category.prodotti.map((element, i) => {
              return (
                <Card
                  className={!isMobile && classes["card-desktop"]}
                  key={i}
                  name={
                    element.prodotto.name.charAt(0).toUpperCase() + element.prodotto.name.slice(1)
                  }
                  price={element.prodotto.price}
                  brand={
                    element.prodotto.brand.charAt(0).toUpperCase() +
                    element.prodotto.brand.slice(1)
                  }
                  star={element.star}
                  path={`/${element.prodotto.image}`}
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
