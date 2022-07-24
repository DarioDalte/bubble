import classes from "./MyReview.module.scss";

import Rating from "@mui/material/Rating";
import DeleteIcon from "@mui/icons-material/Delete";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

function MyReview(props) {
  return (
    <div className={classes.container}>
      <div className={classes.author}>
        <h2>La mia recensione</h2>
        <Rating
          name="read-only"
          value={props.review.value}
          readOnly
          style={{ fontSize: "1.7rem" }}
        />
      </div>
      <div className={classes["review-container"]}>
        <div className={classes.text}>
          <h3 style={{ wordWrap: "break-word" }}>{props.review.title}</h3>
          <p style={{ wordWrap: "break-word" }}>{props.review.text}</p>
        </div>
        <div className={classes.options}>
          <IconButton>
            <EditIcon style={{ color: "#3669c9" }} onClick={props.onChange} />
          </IconButton>
          <IconButton>
            <DeleteIcon style={{ color: "#b8222f" }} onClick={props.onDelete} />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

export default MyReview;
