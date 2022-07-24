import classes from "./Characteristics.module.scss";
import { Divider } from "@mui/material";

function Characteristics(props) {
  if (Object.keys(props.list).length != 0) {
    return (
      <div className={classes.main}>
        <h2 className={classes.title}>Specifiche tecniche</h2>

        {Object.keys(props.variant).map((key, i) => {
          return (
            <>
              <div key={i} className={classes.container}>
                <div className={classes.right}>
                  <span className={classes.subtitle}>{key}</span>
                </div>
                <div className={classes.left}>
                  <span className={classes.text}>
                    {props.variant[key].name}
                  </span>
                </div>
              </div>
              <Divider sx={{ marginTop: "1rem" }} />
            </>
          );
        })}

        {Object.keys(props.list).map((key, i) => {
          return (
            <>
              <div key={i} className={classes.container}>
                <div className={classes.right}>
                  <span className={classes.subtitle}>{key}</span>
                </div>
                <div className={classes.left}>
                  <span className={classes.text}>{props.list[key]}</span>
                </div>
              </div>
              <Divider sx={{ marginTop: "1rem" }} />
            </>
          );
        })}
      </div>
    );
  }

  return <></>;
}

export default Characteristics;
