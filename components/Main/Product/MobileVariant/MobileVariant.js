import classes from "./MobileVariant.module.scss";

import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Divider } from "@mui/material";

function MobileVariant(props) {
  return Object.keys(props.varianti).map((key, index) => {
    return (
      <Accordion key={index}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={{ alignItems: "center" }}
        >
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
        </AccordionSummary>
        <AccordionDetails sx={{ display: "flex", gap: "1rem" }}>
          <div className={classes["scrolling-wrapper"]}>
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
                  className={`${classes.variant} ${
                    isSelected ? classes.selected : ""
                  }`}
                  onClick={() => {
                    let arr = [];
                    window.navigator.vibrate(100);

                    props.variant.map((obj) => {
                      const clone = JSON.parse(JSON.stringify(obj));

                      if (clone.type == key) {
                        clone.id = element.id;
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
                    <p>
                      {(parseFloat(props.initialPrice) + increase).toFixed(2)} €
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </AccordionDetails>
      </Accordion>
    );
  });
}

export default MobileVariant;
