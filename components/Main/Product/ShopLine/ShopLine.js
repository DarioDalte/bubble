import classes from "./ShopLine.module.scss";
import { Divider } from "@mui/material";
import Link from "next/link";
import GppGoodIcon from "@mui/icons-material/GppGood";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
function ShopLine(props) {
  return (
    <div
      onClick={() => {
        window.navigator.vibrate(100);
      }}
    >
      <Link href={`/products/${props.brand}`}>
        <a>
          <Divider sx={{ margin: "1rem 0" }} />
          <div className={classes["middle-container"]}>
            <div className={classes["shop-left"]}>
              <h4 className={classes.title}>{props.brand}</h4>
              <div className={classes["shop-container"]}>
                <p>Negozio ufficiale</p>{" "}
                <GppGoodIcon sx={{ color: "#3669c9" }} />
              </div>
            </div>
            <div className={classes["shop-right"]}>
              <ArrowForwardIosIcon sx={{ color: "#3669c9" }} />
            </div>
          </div>
          <Divider sx={{ marginTop: "1rem", marginBottom: "2rem" }} />
        </a>
      </Link>{" "}
    </div>
  );
}

export default ShopLine;
