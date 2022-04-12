import Link from "next/link";
import React from "react";
import classes from "./ButtonOutlined.module.scss";

function ButtonOutlined(props) {
  if (props.path) {
    return (
      <Link href={props.path}>
        <a
          className={`${props.className} ${classes.button}`}
          onClick={props.onClick}
        >
          {props.value}
        </a>
      </Link>
    );
  } else {
    return (
      <button
        className={`${props.className} ${classes.button}`}
        onClick={props.onClick}
      >
        {props.value}
      </button>
    );
  }
}

export default ButtonOutlined;
