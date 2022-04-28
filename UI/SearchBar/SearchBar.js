import { useState, useRef } from "react";
import classes from "./SearchBar.module.scss";
import SearchIcon from "@mui/icons-material/Search";
import { useRouter } from "next/router";
import Link from "next/link";

export default function SearchBar() {
  const [iconClass, setIconClass] = useState(false);
  const [enteredText, setEnteredText] = useState("");
  const router = useRouter();

  const onSearchHandler = () => {
    if (enteredText.trim().length > 0) {
      router.push(`/products/${enteredText.toLowerCase()}`);
    }
  };

  return (
    <>
      <input
        className={classes.input}
        onChange={(e) => {
          setEnteredText(e.target.value);
        }}
        value={enteredText}
        type="text"
        placeholder="Cerca"
        onFocus={() => {
          setIconClass(true);
        }}
        onBlur={() => {
          setIconClass(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && enteredText) {
            router.push(`/products/${enteredText.toLowerCase()}`);
          }
        }}
      />
      <div className={`${classes.container} ${iconClass && classes.focussed}`}>
        <Link href={enteredText ? `/products/${enteredText}` : "./"} passHref>
          <SearchIcon
            className={classes.icon}
            color="red"
            onClick={onSearchHandler}
          />
        </Link>
      </div>
    </>
  );
}
