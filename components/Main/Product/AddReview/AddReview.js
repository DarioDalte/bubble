import { useState } from "react";
import classes from "./AddReview.module.scss";
import ButtonOutlined from "../../../../UI/ButtonOutlined/ButtonOutlined";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import useInput from "../../../hooks/use-input";
import axios from "axios";

function AddReview(props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [err, setErr] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const {
    value: enteredTitle,
    valueIsValid: titleIsValid,
    hasError: titleHasError,
    valueHandler: titleHandler,
    inputBlur: titleBlurHandler,
    inputFocus: titleFocusHandler,
    reset: titleReset,
    focussing: titleFocussing,
  } = useInput((title) => title.trim().length >= 5);

  const {
    value: enteredDescription,
    valueIsValid: descriptionIsValid,
    hasError: descriptionHasError,
    valueHandler: descriptionHandler,
    inputBlur: descriptionBlurHandler,
    inputFocus: descriptionFocusHandler,
    reset: descriptionReset,
    focussing: descriptionFocussing,
  } = useInput((description) => description.trim().length >= 15);

  const addReviewHandler = () => {
    if (titleIsValid && descriptionIsValid && rating) {
      setErr("");

      const obj = {
        id_product: props.id,
        email: props.session.user.email,
        text: enteredDescription,
        value: rating,
        title: enteredTitle,
      };

      axios.post("/api/inserisci_recensione", obj).then((res) => {
        if (res.data.status) {
          titleReset();
          descriptionReset();
          handleClose();
          const obj = {
            id_user: props.session.user.name,
            email: props.session.user.email,
            text: enteredDescription,
            title: enteredTitle,
            value: rating,
          };
          if (props.reviews.length != 0) {
            let ratingSomma = 0;
            props.reviews.map((review) => {
              ratingSomma += review.value;
            });
            ratingSomma += rating;
            props.setRatingAverage(
              (ratingSomma / (props.reviews.length + 1)).toFixed(1)
            );
          } else {
            props.setRatingAverage(rating);
          }
          props.setMyReview(obj);
          props.setReviewNumber((prevReviewNumber) => prevReviewNumber + 1);
        } else {
          setErr(res.data.message);
        }
      });
    } else {
      setErr("Compila tutti i campi!");
    }
  };

  return (
    <div className={classes.container}>
      {!open && !props.session && (
        <ButtonOutlined value={"Scrivi una recensione"} path={"/login"} />
      )}
      {!open && props.session && (
        <ButtonOutlined value={"Scrivi una recensione"} onClick={handleOpen} />
      )}
      {open && (
        <>
          <div className={classes["review-container"]}>
            <h3 className={classes.title}>Scrivi la tua recensione!</h3>
            <h4 className={classes.error}>{err}</h4>
            <Rating
              name="simple-controlled"
              className={classes.rating}
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
            />
            <TextField
              id="outlined-basic"
              label="Titolo"
              variant="outlined"
              className={classes["textfield"]}
              value={enteredTitle}
              onChange={titleHandler}
              onBlur={titleBlurHandler}
              error={titleHasError}
              onFocus={titleFocusHandler}
              required
            />
            <TextField
              id="outlined-multiline-static"
              label="Descrizione"
              multiline
              rows={4}
              className={classes["textarea"]}
              value={enteredDescription}
              onChange={descriptionHandler}
              onBlur={descriptionBlurHandler}
              error={descriptionHasError}
              onFocus={descriptionFocusHandler}
              required
            />
          </div>
          <div className={classes["bottom-btn-container"]}>
            <ButtonOutlined
              className={classes["close-btn"]}
              value={"Annulla"}
              onClick={handleClose}
            />
            <ButtonOutlined
              className={classes["send-btn"]}
              value={"Invia"}
              onClick={addReviewHandler}
            />
          </div>
        </>
      )}
    </div>
  );
}

export default AddReview;
