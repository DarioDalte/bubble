import classes from "./Phone.module.scss";
import { useState, useRef } from "react";

import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";

import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import Button from "../../../UI/Button/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

function Phone() {
  const [colors, setColors] = useState([]);
  const [color, setColor] = useState(null);
  const [colorIncrease, setColorIncrease] = useState(0);

  const addColorHandler = () => {
    if (color && (colorIncrease || colorIncrease === 0)) {
      setColors([
        ...colors,
        {
          name: color,
          increase: colorIncrease,
        },
      ]);

      setColor("");
      setColorIncrease(0);
    }
  };

  return (
    <div className={classes.container}>
      <h2 className={classes.title}>Inserimento telefono</h2>
      <div className={classes["input-container"]}>
        <TextField
          id="outlined-basic"
          label="Nome"
          variant="outlined"
          className={classes.input}
          required
        />
        <TextField
          id="outlined-basic"
          label="Processore"
          variant="outlined"
          className={classes.input}
          required
        />
        <TextField
          id="outlined-basic"
          label="Sistema operativo"
          variant="outlined"
          className={classes.input}
          required
        />
        <div className={classes["input-container__row"]}>
          <TextField
            id="outlined-basic"
            label="Pollici"
            variant="outlined"
            className={classes.input}
            required
          />
          <FormControl fullWidth required>
            <InputLabel htmlFor="outlined-adornment-amount">Prezzo</InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={
                <InputAdornment position="start">€</InputAdornment>
              }
              label="Prezzo"
            />
          </FormControl>
        </div>
        <Divider lig />

        <h4 className={classes.subtitle}>Colori</h4>
        <div className={classes["input-container__row"]}>
          <TextField
            id="outlined-basic"
            label="Colore"
            variant="outlined"
            className={classes.input}
            onChange={(e) => {
              setColor(e.target.value);
            }}
            value={color}
          />
          <FormControl fullWidth>
            <InputLabel htmlFor="outlined-adornment-amount">
              Incremento
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-amount"
              startAdornment={
                <InputAdornment position="start">€</InputAdornment>
              }
              label="Incremento"
              onChange={(e) => {
                setColorIncrease(e.target.value);
              }}
              value={colorIncrease}
            />
          </FormControl>
        </div>

        <Button
          value="Aggiungi"
          className={classes.btn}
          onClick={addColorHandler}
        />
        {colors.length === 0 ? (
          <p className={classes.text}>Nessun colore aggiunto.</p>
        ) : (
          <div className={classes.table}>
            <div className={classes.row}>
              <div className={`${classes.num} ${classes["table-title"]}`}>
                N°
              </div>
              <div className={`${classes.color} ${classes["table-title"]}`}>
                Colore
              </div>
              <div className={`${classes.increase} ${classes["table-title"]}`}>
                Incremento
              </div>
              <div className={classes.delete}></div>
            </div>
            {colors.map((color, i) => (
              <div className={classes.row} key={i}>
                <div className={classes.num}>{i + 1}</div>
                <div className={classes.color}>{color.name}</div>
                <div className={classes.increase}>€ {color.increase}</div>
                <IconButton
                  aria-label="delete"
                  className={classes.delete}
                  onClick={() => {
                    setColors(colors.filter((item, index) => index !== i));
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Phone;
