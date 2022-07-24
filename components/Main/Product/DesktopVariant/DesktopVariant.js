import classes from "../MobileVariant/MobileVariant.module.scss";
import style from "./DesktopVariant.module.scss";

import { Divider } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";

function DesktopVariant(props) {
  const onVariantClicked = (key, element) => {
    if (props.variant[key]) {
      props.setVariant((prevState) => ({ ...prevState, [key]: element }));
      

      let totalIncrease = 0;
      Object.keys(props.variant).map((variantKey, index) => {
        if (variantKey === key) {
          totalIncrease += parseFloat(element.increase);
        } else {
          totalIncrease += parseFloat(props.variant[variantKey].increase);
        }
      });

      props.setPrice(parseFloat(props.initialPrice) + totalIncrease);
    }
  };

  return (
    <div className={style.container}>
      {Object.keys(props.varianti).map((key, index) => {
        const color = key === "Colore" ? true : false;

        return (
          <div key={index} className={style.line}>
            <div>
              <div className={classes["menu-container"]}>
                <div>
                  <span
                    style={{
                      fontWeight: "600",
                      fontSize: "1.2rem",
                      marginRight: ".5rem",
                    }}
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </span>
                  <span>
                    {props.variant[key] &&
                      props.variant[key].name.charAt(0).toUpperCase() +
                        props.variant[key].name.slice(1)}
                  </span>
                </div>
              </div>
            </div>
            <div sx={{ display: "flex", gap: "1rem" }}>
              <div className={style["variant-container"]}>
                {props.varianti[key].map((element, i) => {
                  let isSelected = false;

                  if (props.variant[key]) {
                    if (element.name === props.variant[key].name) {
                      isSelected = true;
                    }
                  }

                  let increase = parseFloat(element.increase);

                  const dynamicIncrease = parseFloat(
                    element.increase -
                      (props.variant[key] ? props.variant[key].increase : 0)
                  );
                  if (!color) {
                    return (
                      <div
                        key={i}
                        className={` ${style.variant} ${classes.variant} ${
                          isSelected ? classes.selected : ""
                        }`}
                        onClick={() => {
                          onVariantClicked(key, element);
                        }}
                      >
                        <div
                          className={classes.name}
                          style={
                            color
                              ? {
                                  backgroundColor: `#${element.hex}`,
                                  borderRadius: "8px 8px 0 0",
                                }
                              : {}
                          }
                        >
                          {element.name.charAt(0).toUpperCase() +
                            element.name.slice(1)}
                        </div>
                        <Divider />
                        <div className={classes.price}>
                          {/* {(parseFloat(props.initialPrice) + increase).toFixed(2)}{" "} */}
                          {dynamicIncrease === 0 ? (
                            isSelected ? (
                              <DoneIcon />
                            ) : (
                              ""
                            )
                          ) : dynamicIncrease > 0 ? (
                            "+ "
                          ) : (
                            "- "
                          )}
                          {dynamicIncrease != 0
                            ? Math.abs(dynamicIncrease) + "€"
                            : ""}
                        </div>
                      </div>
                    );
                  } else {
                    return (
                      <div
                        key={i}
                        className={`${classes.circle} ${
                          isSelected ? classes.selected : ""
                        }`}
                        style={{ backgroundColor: `#${element.hex}` }}
                        onClick={() => {
                          onVariantClicked(key, element);
                        }}
                      ></div>
                    );
                  }
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
