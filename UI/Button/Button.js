import React from "react";
import classes from "./Button.module.scss";

function Button(props) {
  return (
    <input
      type="button"
      value={props.value}
      className={`${props.className} ${classes.button}`}
      onClick={props.onClick}
    />
  );
}

export default Button;
