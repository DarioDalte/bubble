import classes from "./BackArrow.module.scss";
import Link from "next/link";

import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

function BackArrow(props) {
  return (
    <div
      style={props.sx}
      onClick={() => {
        window.navigator.vibrate(100);
      }}
    >
      <Link href={props.path ? props.path : "/"} passHref>
        <IconButton
          className={`${classes["arrow-container"]} ${props.classes}`}
        >
          <ArrowBackIcon className={classes.arrow} />
        </IconButton>
      </Link>
    </div>
  );
}

export default BackArrow;
