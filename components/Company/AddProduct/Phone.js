import classes from "./Phone.module.scss";
import { useState, useRef, useEffect } from "react";

import TextField from "@mui/material/TextField";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Image from "next/image";

import FormControl from "@mui/material/FormControl";
import Divider from "@mui/material/Divider";
import Variants from "../UI/Variants/Variants";
import VariantsCircle from "../UI/VariantsCircle/VariantsCircle";
import Button from "../../../UI/Button/Button";
import useInput from "../../hooks/use-input";
import Card from "../../../UI/Card/Card";
import Loading from "../../../UI/Loading/Loading";
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";

import ImageUploading from "react-images-uploading";
import { useMutate } from "restful-react";

function Phone(props) {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [colors, setColors] = useState([]);
  const [color, setColor] = useState("");
  const [colorIncrease, setColorIncrease] = useState(0);

  const [memories, setMemories] = useState([]);
  const [selectedMemory, setSelectedMemory] = useState();
  const [memory, setMemory] = useState("");
  const [memoryIncrease, setMemoryIncrease] = useState(0);
  const memoriesList = [64, 128, 256];

  const [rams, setRams] = useState([]);
  const [selectedRam, setSelectedRam] = useState();
  const [ram, setRam] = useState("");
  const [ramIncrease, setRamIncrease] = useState(0);
  const ramList = [2, 4, 8];

  const [images, setImages] = useState([]);
  const maxNumber = 69;

  const { mutate: uploadImage } = useMutate({
    verb: "POST",
    path: "/api/upload_images",
  });

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
    if (color && (colorIncrease || colorIncrease >= 0)) {
      setColors([
        ...colors,
        {
          name: color,
          increase: colorIncrease ? colorIncrease : 0,
        },
      ]);

      setColor("");
      setColorIncrease(0);
    }
  };

  const addMemoryHandler = () => {
    if ((memory > 0 || selectedMemory >= 0) && memoryIncrease >= 0) {
      setMemories([
        ...memories,
        {
          name: `${memory ? memory : memoriesList[selectedMemory]}GB`,
          increase: memoryIncrease ? memoryIncrease : 0,
        },
      ]);

      setMemory("");
      setMemoryIncrease(0);
      setSelectedMemory(-1);
    }
  };

  const addRamHandler = () => {
    if ((ram > 0 || selectedRam >= 0) && ramIncrease >= 0) {
      setRams([
        ...rams,
        {
          name: `${ram ? ram : ramList[selectedRam]}GB`,
          increase: ramIncrease ? ramIncrease : 0,
        },
      ]);

      setRam("");
      setRamIncrease(0);
      setSelectedRam(-1);
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
      memories.length >= 1 &&
      images.length >= 1
    ) {
      setError("");
      // setIsLoading(true);
      const imagesList = images.map((image) => image.file.name);

      const obj = {
        brand: props.companyName,
        name: enteredName,
        category: "Informatica",
        sub_categories: ["Telefoni"],
        images: imagesList,
        pollici: enteredPollici,
        price: enteredPrice,
        OS: enteredOs,
        processore: enteredProcessor,
        varianti: { Colore: colors, Ram: rams, Memoria: memories },
      };
      // console.log(obj);

      const formData = new FormData();
      images.map((image) => {
        formData.append("image", image.file);
      });

      // console.log(formData);
      uploadImage(formData)
        .then((res) => {
          // console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });

      axios.post("/api/add_product", obj).then((res) => {
        setIsLoading(false);
      });
    } else {
      nameBlurHandler();
      processorBlurHandler();
      osBlurHandler();
      polliciBlurHandler();
      priceBlurHandler();
      window.scrollTo(0, 0);
      setError(
        "Inserisci tutti i valori e almeno una variante per ogni categoria"
      );
    }
  };

  // const [image, setImage] = useState([]);
  // const [imageUrl, setImageUrl] = useState([]);
  // console.log(imageUrl);

  // useEffect(() => {
  //   if (image.length < 1) return;
  //   const newImageUrl = URL.createObjectURL(image);
  //   setImageUrl(newImageUrl);
  // }, [image]);

  // const imageHandler = (e) => {
  //   setImage(e.target.files[0]);
  // };

  const onChange = (imageList, addUpdateIndex) => {
    // data for submit

    setImages(imageList);
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

        <VariantsCircle
          sectionName={"Memoria"}
          name={"GB"}
          selectList={memoriesList}
          onClick={addMemoryHandler}
          selected={selectedMemory}
          setSelected={setSelectedMemory}
          list={memories}
          setList={setMemories}
          variant={memory}
          increase={memoryIncrease}
          setVariant={setMemory}
          setIncrease={setMemoryIncrease}
          empty={"Nessuna memoria aggiunta."}
        />

        <Divider sx={{ margin: "2rem 0" }} />

        <VariantsCircle
          sectionName={"Memoria RAM"}
          name={"GB"}
          selectList={ramList}
          onClick={addRamHandler}
          selected={selectedRam}
          setSelected={setSelectedRam}
          list={rams}
          setList={setRams}
          variant={ram}
          increase={ramIncrease}
          setVariant={setRam}
          setIncrease={setRamIncrease}
          empty={"Nessuna memoria aggiunta."}
        />

        <Divider sx={{ marginTop: "2rem" }} />
        <h2 style={{ marginBottom: 0 }} className={classes.title}>
          Carica delle immagini
        </h2>
        <p className={classes["helper-text"]}>
          P.S. Ricorda che la prima immagine che caricherai sarà quella mostrata
          sulla card.
        </p>
        <div className="App">
          <ImageUploading
            multiple
            value={images}
            onChange={onChange}
            maxNumber={maxNumber}
            dataURLKey="data_url"
          >
            {({
              imageList,
              onImageUpload,
              onImageRemoveAll,
              onImageUpdate,
              onImageRemove,
              isDragging,
              dragProps,
            }) => (
              // write your building UI
              <div className={classes["image-wrapper"]}>
                <button
                  className={classes["image-dropper"]}
                  style={isDragging ? { color: "red" } : undefined}
                  onClick={onImageUpload}
                  {...dragProps}
                >
                  Clicca o trascina qui
                </button>

                <div className={classes["photo-list-container"]}>
                  {imageList.map((image, index) => (
                    <div key={index} className={classes["list-item"]}>
                      <Image
                        src={image["data_url"]}
                        width={100}
                        height={100}
                        alt={"Phone photo"}
                      />

                      <span
                        className={classes["change-photo"]}
                        onClick={() => onImageUpdate(index)}
                      >
                        Cambia
                      </span>
                      <IconButton
                        aria-label="delete"
                        className={classes.delete}
                        onClick={() => onImageRemove(index)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  ))}
                </div>
                {imageList.length === 0 ? (
                  <span className={classes.text}>
                    Nessuna immagine caricata.
                  </span>
                ) : (
                  <button
                    className={classes["remove-all-image"]}
                    onClick={onImageRemoveAll}
                  >
                    Rimuovi tutte le immagini
                  </button>
                )}
              </div>
            )}
          </ImageUploading>
        </div>
        <Divider sx={{ marginTop: "2rem" }} />

        <h2 className={classes.title}>Card Preview</h2>

        <div className={classes["card-container"]}>
          <Card
            path={images[0] && images[0]["data_url"]}
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
