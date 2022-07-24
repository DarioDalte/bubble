import { useState } from "react";
import classes from "./AddReview.module.scss";
import ButtonOutlined from "../../../../UI/ButtonOutlined/ButtonOutlined";
import Rating from "@mui/material/Rating";
import TextField from "@mui/material/TextField";
import useInput from "../../../hooks/use-input";
import axios from "axios";
import RatingLine from "../RatingLine/RatingLine";
import MyReview from "./MyReview/MyReview";
import CircularProgress from "@mui/material/CircularProgress";

function AddReview(props) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [err, setErr] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [reviewIsLoading, setReviewIsLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    isEditing && setIsEditing(false);
    setOpen(false);
  };

  const {
    value: enteredTitle,
    valueIsValid: titleIsValid,
    hasError: titleHasError,
    valueHandler: titleHandler,
    inputBlur: titleBlurHandler,
    inputFocus: titleFocusHandler,
    reset: titleReset,
    focussing: titleFocussing,
    setValue: setTitle,
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
    setValue: setDescription,
  } = useInput((description) => description.trim().length >= 15);

  const addReviewHandler = () => {
    if (titleIsValid && descriptionIsValid && rating) {
      setErr("");
      setReviewIsLoading(true);

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

          const tempReviews = [...props.reviews];
          tempReviews.push(obj);
          if (tempReviews != 0) {
            let ratingSomma = 0;
            tempReviews.map((review) => {
              ratingSomma += review.value;
            });

            props.setRatingAverage(
              (ratingSomma / (props.reviews.length + 1)).toFixed(1)
            );
          } else {
            props.setRatingAverage(rating);
          }
          props.setMyReview(obj);
          props.setReviews(tempReviews);
          props.setReviewNumber((prevReviewNumber) => prevReviewNumber + 1);
        } else {
          setErr(res.data.message);
        }
        setReviewIsLoading(false);
      });
    } else {
      setErr("Compila tutti i campi!");
    }
  };

  const onChange = () => {
    setTitle(props.myReview.title);
    setDescription(props.myReview.text);
    setRating(props.myReview.value);

    setIsEditing(true);
    handleOpen();
  };

  const changeReviewHandler = () => {
    if (titleIsValid && descriptionIsValid && rating) {
      if (
        props.myReview.text != enteredDescription ||
        props.myReview.title != enteredTitle ||
        props.myReview.value != rating
      ) {
        setErr("");
        setReviewIsLoading(true);

        const obj = {
          id_product: props.id,
          email: props.session.user.email,
          id_user: props.myReview.id_user,
          text: enteredDescription,
          value: rating,
          title: enteredTitle,
        };

        axios.post("/api/updateReview", obj).then((res) => {
          setReviewIsLoading(false);
          titleReset();
          descriptionReset();
          handleClose();

          const tempReviews = [...props.reviews];

          for (let i = 0; i < tempReviews.length; i++) {
            const review = tempReviews[i];
            if (props.myReview.email == review.email) {
              tempReviews[i] = obj;
            }
          }

          let ratingSomma = 0;
          tempReviews.map((review) => {
            ratingSomma += review.value;
          });

          props.setRatingAverage(
            (ratingSomma / props.reviews.length).toFixed(1)
          );

          props.setMyReview(obj);
          props.setReviews(tempReviews);
        });
      } else {
        setErr("Devi prima modificare qualcosa!");
      }
    } else {
      setErr("Compila tutti i campi!");
    }
  };

  if (titleFocussing || descriptionFocussing) {
    props.setShowBottomNav(false);
  } else {
    props.setShowBottomNav(true);
  }
  if (!props.myReview || isEditing) {
    return (
      <div className={classes.main}>
        {!props.isMobile && (
          <RatingLine
            reviewNumber={props.reviewNumber}
            ratingAverage={props.ratingAverage}
          />
        )}

        <div className={classes.container}>
          {!open && !props.session && (
            <>
              <h3 style={{ marginBottom: "2rem", textAlign: "center" }}>
                {" "}
                Se vuoi scrivere una recensione, prima accedi!
              </h3>
              <ButtonOutlined value={"Accedi"} path={"/login"} />
            </>
          )}
          {!open && props.session && (
            <ButtonOutlined
              value={"Scrivi una recensione"}
              onClick={handleOpen}
            />
          )}
          {open && (
            <>
              <div className={classes["review-container"]}>
                <h3 className={classes.title}>
                  {isEditing ? "Modifica" : "Scrivi"} la tua recensione!
                </h3>
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
                  value={
                    !reviewIsLoading ? (
                      !isEditing ? (
                        "Invia"
                      ) : (
                        "Modifica"
                      )
                    ) : (
                      <CircularProgress
                        size={35}
                        style={{ color: "inherit" }}
                      />
                    )
                  }
                  onClick={
                    !reviewIsLoading
                      ? !isEditing
                        ? addReviewHandler
                        : changeReviewHandler
                      : () => {}
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>
    );
  } else {
    return (
      !props.isMobile && (
        <MyReview
          review={props.myReview}
          onDelete={props.onDelete}
          onChange={onChange}
        />
      )
    );
  }
}

export default AddReview;
