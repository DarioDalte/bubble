import classes from "../Variants/Variants.module.scss";
import style from "./VariantsCircle.module.scss";
import Button from "../../../../UI/Button/Button";

import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import { useState } from "react";

function VariantsCircle(props) {
  const [showOther, setShowOther] = useState();

  return (
    <>
      <h4 className={classes.subtitle}>{props.sectionName}</h4>
      <div className={classes["input-container__row"]}>
        <div className={style.container}>
          <div className={style["circle-container"]}>
            {props.selectList.map((element, i) => (
              <div
                key={i}
                className={`${style.circle} ${
                  props.selected === i ? style.selected : ""
                }`}
                onClick={(e) => {
                {!showOther &&  props.setSelected(i);}
                }}
              >
                {element}
              </div>
            ))}
          </div>

          <span
            className={style.text}
            onClick={() => {
              setShowOther((showOther) => !showOther);
              props.setSelected(-1);
            }}
          >
            {!showOther ? "Altro" : "Nascondi"}
          </span>
        </div>
        <FormControl fullWidth>
          <InputLabel htmlFor="outlined-adornment-amount">
            Incremento
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            startAdornment={<InputAdornment position="start">€</InputAdornment>}
            label="Incremento"
            onChange={(e) => {
              props.setIncrease(e.target.value);
            }}
            value={props.increase}
          />
        </FormControl>
      </div>

      {showOther && (
        <TextField
          id="outlined-basic"
          label={props.name}
          variant="outlined"
          className={style.input}
          onChange={(e) => {
            props.setVariant(e.target.value);
          }}
          value={props.variant}
        />
      )}

      <Button
        value="Aggiungi"
        className={classes.btn}
        onClick={props.onClick}
      />
      {props.list.length === 0 ? (
        <p className={classes.text}>{props.empty}</p>
      ) : (
        <div className={classes.table}>
          <div className={classes.row}>
            <div className={`${classes.num} ${classes["table-title"]}`}>N°</div>
            <div className={`${classes.color} ${classes["table-title"]}`}>
              {props.name}
            </div>
            <div className={`${classes.increase} ${classes["table-title"]}`}>
              Incremento
            </div>
            <div className={classes.delete}></div>
          </div>
          {props.list.map((color, i) => (
            <div className={classes.row} key={i}>
              <div className={classes.num}>{i + 1}</div>
              <div className={classes.color}>{color.name}</div>
              <div className={classes.increase}>€ {color.increase}</div>
              <IconButton
                aria-label="delete"
                className={classes.delete}
                onClick={() => {
                  props.setList(
                    props.list.filter((item, index) => index !== i)
                  );
                }}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default VariantsCircle;
