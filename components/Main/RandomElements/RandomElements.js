import Card from "../../../UI/Card/Card";
import classes from "./RandomElements.module.scss";

const RandomElements = (props) => (
  <div className={classes.container}>
    {props.randomElements.map((category, i) => (
      <div key={i}  className={classes['category-container']}>
        
        <span className={classes.text}>{category.categoria}</span>
        <div className={classes["scrolling-wrapper"]}>
          {category.prodotti.map((element, i) => (
            <Card
              className={classes.card}
              key={i}
              name={element.name}
              price={element.price}
              brand={element.brand}
              star={0}
              path={"/galaxybuds.webp"}
            />
          ))}
        </div>
      </div>
    ))}
  </div>
);

export default RandomElements;
