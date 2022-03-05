import classes from "./Categories.module.scss";

import React from "react";
import Category from "./Category";

import FastfoodIcon from "@mui/icons-material/Fastfood";

function Categories(props) {
  const dummy_categories = [
    {
      title: "Food",
      color: "#5eff0042",
      icon: <FastfoodIcon className={classes.icon} />,
    },
  ];

  return (
    <div className={props.classes}>
      <div className={classes.header}>
        <p className={classes.text}>Categories</p>
        <p className={classes.text}>See All</p>
      </div>
      <div className={classes.categories}>
        <Category
          title={"Food"}
          color={"#5eff0042"}
          icon={<FastfoodIcon className={classes.icon} />}
        />
        <Category
          title={"Food"}
          color={"#5eff0042"}
          icon={<FastfoodIcon className={classes.icon} />}
        />
        <Category
          title={"Food"}
          color={"#5eff0042"}
          icon={<FastfoodIcon className={classes.icon} />}
        />
        <Category
          title={"Food"}
          color={"#5eff0042"}
          icon={<FastfoodIcon className={classes.icon} />}
        />
      </div>
    </div>
  );
}

export default Categories;
