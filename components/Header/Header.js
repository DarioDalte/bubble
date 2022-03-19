import classes from "./Header.module.scss";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import Container from "@mui/material/Container";
import SearchBar from "../../UI/SearchBar/SearchBar";

function Header() {
  return (
    <>
      <header className={classes.header}>
        <div className={classes.logo}></div>
        <div className={classes.title}>Bubble</div>
        <div className={classes.activity}>
          <ShoppingCartOutlinedIcon />
        </div>
      </header>
      <Container maxWidth="md" className={classes.container}>
        <SearchBar/>       
      </Container>
      
    </>
  );
}

export default Header;
