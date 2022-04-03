import classes from "./Header.module.scss";
import Link from "next/link";


import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import Container from "@mui/material/Container";
import SearchBar from "../../UI/SearchBar/SearchBar";

import useMediaQuery from "@mui/material/useMediaQuery";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

function Header() {
  const isMobile = useMediaQuery("(max-width:47rem)");
  return (
    <>
      <header className={classes.header}>
        <div className={classes.logo}>logo</div>
        <div className={classes.title}>
          {isMobile ? "Bubble" : <SearchBar />}
        </div>
        <div className={classes.activity}>
          {!isMobile && (
            <Link href={"/profile"} passHref>
              <PersonOutlineIcon className={classes.person} />
            </Link>
          )}
          <ShoppingCartOutlinedIcon className={classes.cart} />
        </div>
      </header>

      {isMobile && (
        <Container maxWidth="md" className={classes.container}>
          <SearchBar />
        </Container>
      )}
    </>
  );
}

export default Header;
