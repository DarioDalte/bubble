import classes from "./MobileVariant.module.scss";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Divider } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";

function MobileVariant(props) {
  const onVariantClicked = (key, element) => {
    window.navigator.vibrate(100);
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

  return Object.keys(props.varianti).map((key, index) => {
    const color = key === "Colore" ? true : false;
    return (
      <Accordion key={index}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ alignItems: "center" }}
        >
          <div className={classes["menu-container"]}>
            <div>
              <span
                style={{
                  fontWeight: "600",
                  fontSize: "1.2rem",
                  marginRight: ".5rem",
                }}
              >
                {key}:
              </span>
              <span>{props.variant[key].name}</span>
            </div>

            {color && (
              <div
                className={`${classes.mobileCircle}`}
                style={{
                  backgroundColor: `#${props.variant[key].hex}`,
                  width: "33px",
                  height: "33px",
                  margin: "0 1rem 0 0",
                }}
              ></div>
            )}
          </div>
        </AccordionSummary>
        <AccordionDetails sx={{ display: "flex", gap: "1rem" }}>
          <div className={classes["scrolling-wrapper"]}>
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
                    className={`${classes.variant} ${
                      isSelected ? classes.selected : ""
                    }`}
                    onClick={() => {
                      onVariantClicked(key, element);
                    }}
                  >
                    <div className={classes.name}>
                      {element.name.charAt(0).toUpperCase() +
                        element.name.slice(1)}
                    </div>
                    <Divider />
                    <div className={classes.price}>
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
                    className={`${classes.mobileCircle} ${
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
        </AccordionDetails>
      </Accordion>
    );
  });
}

export default MobileVariant;
