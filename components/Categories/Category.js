import classes from "./Category.module.scss";

function Category(props) {
  return <div className={classes.category} style={{background: props.color}}
  >{props.icon}</div>;
}

export default Category;
