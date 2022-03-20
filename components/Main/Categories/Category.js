import classes from "./Category.module.scss";

function Category(props) {

  return (
    <div className={classes.container}>
      <div className={classes.category} style={{ background: props.color }}>
        {props.icon}
      </div>
      {props.title}
    </div>
  );
}

export default Category;
