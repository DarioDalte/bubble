import { useState } from "react";
import classes from "./SearchBar.module.scss";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  const [iconClass, setIconClass] = useState(false);

  return (
    <>
      <input
        className={classes.input}
        type="text"
        placeholder="Cerca"
        onFocus={() => {
          setIconClass(true);
        }}
        onBlur={() => {
          setIconClass(false);
        }}

      />
      <div className={`${classes.container} ${iconClass && classes.focussed}`}>
        <SearchIcon className={classes.icon} color="red" />
      </div>
    </>
  );
}
