import classes from "./SearchBar.module.scss";
import SearchIcon from "@mui/icons-material/Search";

export default function SearchBar() {
  return (
    <>
      <input className={classes.input} type="text" placeholder="Search" />
      <div className={classes.container}>
        <SearchIcon className={classes.icon} color="red" />
      </div>
    </>
  );
}



