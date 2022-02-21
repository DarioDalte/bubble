import classes from "./Header.module.scss";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import SearchBar from "material-ui-search-bar";
import Container from "@mui/material/Container";

function Header() {
  return (
    <>
      <header className={classes.header}>
        <div className={classes.logo}></div>
        <div className={classes.title}>Marketplace</div>
        <div className={classes.activity}>
          <ShoppingCartOutlinedIcon />
        </div>
      </header>
      <Container maxWidth="sm">
        <SearchBar className={classes['search-bar']} /> {/** PER I VALORI https://www.npmjs.com/package/material-ui-search-bar, INOLTRE CERCA FOCUS  */}
        
      </Container>
      
    </>
  );
}

export default Header;
