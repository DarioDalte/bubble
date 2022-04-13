import classes from "./Phone.module.scss";
import { useState, useRef } from "react";

import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";

import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import Variants from "../UI/Variants";
import Button from "../../../UI/Button/Button";
import useInput from "../../hooks/use-input";
import Card from "../../../UI/Card/Card";
import Loading from "../../../UI/Loading/Loading";
import axios from "axios";

function Phone(props) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [colors, setColors] = useState([]);
  const [color, setColor] = useState("");
  const [colorIncrease, setColorIncrease] = useState(0);

  const [memories, setMemories] = useState([]);
  const [memory, setMemory] = useState("");
  const [memoryIncrease, setMemoryIncrease] = useState(0);

  const [rams, setRams] = useState([]);
  const [ram, setRam] = useState("");
  const [ramIncrease, setRamIncrease] = useState(0);

  const {
    value: enteredName,
    valueIsValid: nameIsValid,
    hasError: nameHasError,
    valueHandler: nameHandler,
    inputBlur: nameBlurHandler,
    inputFocus: nameFocusHandler,
    reset: nameReset,
    focussing: nameFocussing,
  } = useInput((name) => name.trim().length >= 1);

  const {
    value: enteredProcessor,
    valueIsValid: processorIsValid,
    hasError: processorHasError,
    valueHandler: processorHandler,
    inputBlur: processorBlurHandler,
    inputFocus: processorFocusHandler,
    reset: processorReset,
    focussing: processorFocussing,
  } = useInput((processor) => processor.trim().length >= 3);

  const {
    value: enteredOs,
    valueIsValid: osIsValid,
    hasError: osHasError,
    valueHandler: osHandler,
    inputBlur: osBlurHandler,
    inputFocus: osFocusHandler,
    reset: osReset,
    focussing: osFocussing,
  } = useInput((os) => os.trim().length >= 2);

  const {
    value: enteredPollici,
    valueIsValid: polliciIsValid,
    hasError: polliciHasError,
    valueHandler: polliciHandler,
    inputBlur: polliciBlurHandler,
    inputFocus: polliciFocusHandler,
    reset: polliciReset,
    focussing: polliciFocussing,
  } = useInput((pollici) => pollici.trim().length >= 1);

  const {
    value: enteredPrice,
    valueIsValid: priceIsValid,
    hasError: priceHasError,
    valueHandler: priceHandler,
    inputBlur: priceBlurHandler,
    inputFocus: priceFocusHandler,
    reset: priceReset,
    focussing: priceFocussing,
  } = useInput((price) => price.trim().length >= 1);

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

  const addMemoryHandler = () => {
    if (memory && (memoryIncrease || memoryIncrease === 0)) {
      setMemories([
        ...memories,
        {
          name: memory,
          increase: memoryIncrease,
        },
      ]);

      setMemory("");
      setMemoryIncrease(0);
    }
  };

  const addRamHandler = () => {
    if (ram && (ramIncrease || ramIncrease === 0)) {
      setRams([
        ...rams,
        {
          name: ram,
          increase: ramIncrease,
        },
      ]);

      setRam("");
      setRamIncrease(0);
    }
  };

  const sendDataHandler = () => {
    if (
      nameIsValid &&
      processorIsValid &&
      osIsValid &&
      priceIsValid &&
      polliciIsValid &&
      colors.length >= 1 &&
      rams.length >= 1 &&
      memories.length >= 1
    ) {
      setError("");
      setIsLoading(true);

      const obj = {
        brand: props.companyName,
        name: enteredName,
        category: "Informatica",
        sub_categories: ["Telefoni"],
        image: "test",
        pollici: enteredPollici,
        price: enteredPrice,
        OS: enteredOs,
        processore: enteredProcessor,
        varianti: { colors: colors, RAM: rams, SSD: memories },
      };
      console.log(obj);

      axios.post("/api/add_product", obj).then((res) => {
        setIsLoading(false);
      });
    } else {
      window.scrollTo(0, 0);
      setError(
        "Inserisci tutti i valori e almeno una variante per ogni categoria"
      );
    }
  };

  return (
    <div className={classes.container}>
      <Loading open={isLoading} />
      <h2 className={classes.title}>Inserimento telefono</h2>
      {error && <h4 className={classes.error}>{error}</h4>}
      <div className={classes["input-container"]}>
        <TextField
          id="outlined-basic"
          label="Name"
          variant="outlined"
          className={classes.input}
          value={enteredName}
          onChange={nameHandler}
          onBlur={nameBlurHandler}
          error={nameHasError}
          onFocus={nameFocusHandler}
          required
        />
        <TextField
          id="outlined-basic"
          label="Processore"
          variant="outlined"
          className={classes.input}
          value={enteredProcessor}
          onChange={processorHandler}
          onBlur={processorBlurHandler}
          error={processorHasError}
          onFocus={processorFocusHandler}
          required
        />
        <TextField
          id="outlined-basic"
          label="Sistema operativo"
          variant="outlined"
          className={classes.input}
          value={enteredOs}
          onChange={osHandler}
          onBlur={osBlurHandler}
          error={osHasError}
          onFocus={osFocusHandler}
          required
        />
        <div className={classes["input-container__row"]}>
          <TextField
            id="outlined-basic"
            label="Pollici"
            variant="outlined"
            className={classes.input}
            value={enteredPollici}
            onChange={polliciHandler}
            onBlur={polliciBlurHandler}
            error={polliciHasError}
            onFocus={polliciFocusHandler}
            required
            type="number"
          />
          <FormControl fullWidth required error={priceHasError}>
            <InputLabel htmlFor="outlined-adornment-amount">Prezzo</InputLabel>
            <OutlinedInput
              value={enteredPrice}
              onChange={priceHandler}
              onBlur={priceBlurHandler}
              onFocus={priceFocusHandler}
              type="number"
              id="outlined-adornment-amount"
              startAdornment={
                <InputAdornment position="start">€</InputAdornment>
              }
              label="Prezzo"
            />
          </FormControl>
        </div>
        <Divider sx={{ marginTop: "2rem" }} />
        <h2 className={classes.title}>Varianti</h2>

        <Variants
          sectionName={"Colori"}
          name={"Colore"}
          onClick={addColorHandler}
          list={colors}
          setList={setColors}
          variant={color}
          increase={colorIncrease}
          setVariant={setColor}
          setIncrease={setColorIncrease}
          empty={"Nessun colore aggiunto."}
        />
        <Divider sx={{ margin: "2rem 0" }} />

        <Variants
          sectionName={"Memoria"}
          name={"GB"}
          onClick={addMemoryHandler}
          list={memories}
          setList={setMemories}
          variant={memory}
          increase={memoryIncrease}
          setVariant={setMemory}
          setIncrease={setMemoryIncrease}
          empty={"Nessuna memoria aggiunta."}
        />

        <Divider sx={{ margin: "2rem 0" }} />

        <Variants
          sectionName={"Memoria RAM"}
          name={"GB"}
          onClick={addRamHandler}
          list={rams}
          setList={setRams}
          variant={ram}
          increase={ramIncrease}
          setVariant={setRam}
          setIncrease={setRamIncrease}
          empty={"Nessuna memoria aggiunta."}
        />
        <h2 className={classes.title}>Card Preview</h2>

        <div className={classes["card-container"]}>
          <Card
            path={"/test"}
            brand={props.companyName}
            name={enteredName}
            price={enteredPrice}
          />
        </div>

        <Button
          value="Invia"
          className={classes.btn}
          onClick={sendDataHandler}
        />
      </div>
    </div>
  );
}

export default Phone;
