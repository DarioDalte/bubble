import classes from "./Header.module.scss";
import Link from "next/link";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";

import Container from "@mui/material/Container";
import SearchBar from "../../UI/SearchBar/SearchBar";

import { IconButton, useMediaQuery } from "@mui/material";
import ProfileMenu from "./ProfileMenu/ProfileMenu";

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
            <ProfileMenu
              buttonClass={classes["icon-button"]}
              iconClass={classes.icon}
            />
          )}

          <IconButton className={classes["icon-button"]}>
            <ShoppingCartOutlinedIcon className={classes.icon} />
          </IconButton>
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
