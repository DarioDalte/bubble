import classes from "../MobileVariant/MobileVariant.module.scss";
import style from "./DesktopVariant.module.scss";

import { Divider } from "@mui/material";

function DesktopVariant(props) {
  return (
    <div className={style.container}>
      {Object.keys(props.varianti).map((key, index) => {
        return (
          <div key={index} className={style.line}>
            <div>
              <div className={classes["menu-container"]}>
                <span
                  style={{
                    fontWeight: "600",
                    fontSize: "1.2rem",
                    marginRight: ".5rem",
                  }}
                >
                  {key}:
                </span>
                <span>
                  {props.variant.map((ourVariant) => {
                    if (ourVariant.type == key) {
                      return ourVariant.name;
                    }
                  })}
                </span>
              </div>
            </div>
            <div sx={{ display: "flex", gap: "1rem" }}>
              <div className={style["variant-container"]}>
                {props.varianti[key].map((element, i) => {
                  let isSelected = false;
                  props.variant.map(
                    (ourVariant) =>
                      ourVariant.type == key &&
                      ourVariant.name == element.name &&
                      (isSelected = true)
                  );

                  let increase = parseFloat(element.increase);

                  props.variant.map((element) => {
                    if (element.type != key) {
                      increase += parseFloat(element.increase);
                    }
                  });

                  return (
                    <div
                      key={i}
                      className={` ${style.variant} ${classes.variant} ${
                        isSelected ? classes.selected : ""
                      }`}
                      onClick={() => {
                        let arr = [];

                        props.variant.map((obj) => {
                          const clone = JSON.parse(JSON.stringify(obj));

                          if (clone.type == key) {
                            clone.name = element.name;
                            clone.increase = element.increase;
                          }
                          arr.push(clone);
                        });

                        props.setVariant(arr);

                        let totalIncrease = 0;
                        arr.map((element) => {
                          totalIncrease += parseFloat(element.increase);
                        });
                        props.setPrice(props.initialPrice + totalIncrease);
                      }}
                    >
                      <div className={classes.name}>{element.name}</div>
                      <Divider />
                      <div className={classes.price}>
                        {(parseFloat(props.initialPrice) + increase).toFixed(2)}{" "}
                        €
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DesktopVariant;
