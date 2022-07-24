import classes from './RatingLine.module.scss'

import StarIcon from "@mui/icons-material/Star";

function RatingLine(props) {
  return (
    <div className={classes.rating}>
      <div className={classes["rating-average"]}>
        <StarIcon sx={{ color: "#faaf00" }} /> {props.ratingAverage}
      </div>
      <div className={classes["rating-number"]}>
        <p>{props.reviewNumber}</p>
        <p>{props.reviewNumber === 1 ? "Recensione" : "Recensioni"}</p>
      </div>
    </div>
  );
}

export default RatingLine;
