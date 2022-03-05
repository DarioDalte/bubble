import classes from "./Categories.module.scss";

import React from "react";
import Category from "./Category";

import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import SportsVolleyballOutlinedIcon from "@mui/icons-material/SportsVolleyballOutlined";
function Categories(props) {
  const dummy_categories = [
    {
      title: "Vestiti",
      color: "#E4F3EA",
      icon: (
        <SportsVolleyballOutlinedIcon
          className={classes.icon}
          style={{ color: "#3A9B7A" }}
        />
      ),
    },
    {
      title: "Telefoni",
      color: "#FFECE8",
      icon: (
        <PhoneAndroidOutlinedIcon
          className={classes.icon}
          style={{ color: "#FE6E4C" }}
        />
      ),
    },
    {
      title: "Computer",
      color: "#FFF6E4",
      icon: (
        <ComputerOutlinedIcon
          className={classes.icon}
          style={{ color: "#FFC120" }}
        />
      ),
    },
    {
      title: "Sport",
      color: "#F1EDFC",
      icon: (
        <SportsVolleyballOutlinedIcon
          className={classes.icon}
          style={{ color: "#9B81E5" }}
        />
      ),
    },
    {
      title: "Test",
      color: "#E4F3EA",
      icon: (
        <SportsVolleyballOutlinedIcon
          className={classes.icon}
          style={{ color: "#3A9B7A" }}
        />
      ),
    },
  ];

  return (
    <div className={props.classes}>
      <div className={classes.header}>
        <p className={classes.text}>Categorie</p>
        <p className={classes.text}>Guarda tutte</p>
      </div>
      <div className={classes.container}>
        <div className={classes.categories}>
          {dummy_categories.map((category, i) => {
            return (
              <Category
                key={i}
                title={category.title}
                color={category.color}
                icon={category.icon}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Categories;
