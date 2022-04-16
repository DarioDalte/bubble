import { useState, useRef } from "react";
import classes from "./SearchBar.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";

export default function SearchBar() {
  const [iconClass, setIconClass] = useState(false);
  const inputRef = useRef();
  const router = useRouter();

  return (
    <>
      <input
        className={classes.input}
        ref={inputRef}
        type="text"
        placeholder="Cerca"
        onFocus={() => {
          setIconClass(true);
        }}
        onBlur={() => {
          setIconClass(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && inputRef.current.value) {
            router.push(`/products/${inputRef.current.value}`);
          }
        }}
      />
      <div className={`${classes.container} ${iconClass && classes.focussed}`}>
        <SearchIcon className={classes.icon} color="red" />
      </div>
    </>
  );
}
