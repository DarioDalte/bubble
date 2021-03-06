import classes from "./Header.module.scss";
import Link from "next/link";

import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import AddIcon from "@mui/icons-material/Add";

import Container from "@mui/material/Container";
import SearchBar from "../../UI/SearchBar/SearchBar";

import { IconButton, useMediaQuery } from "@mui/material";
import ProfileMenu from "./ProfileMenu/ProfileMenu";
import Image from "next/image";

function Header(props) {
  const isMobile = useMediaQuery("(max-width:47rem)");

  return (
    <>
      <header className={classes.header}>
        <div className={classes.logo}>
          <Link href={"/"} passHref>
            <a>
              <Image
                className={classes.image}
                src={"/logo.png"}
                width={58}
                height={65}
                alt={"Bubble logo"}
              />
            </a>
          </Link>
        </div>
        <div className={classes.title}>
          {isMobile ? "Bubble" : <SearchBar />}
        </div>
        <div className={classes.activity}>
          {!isMobile && (
            <ProfileMenu
              buttonClass={classes["icon-button"]}
              iconClass={classes.icon}
              session={props.session}
            />
          )}
          {!props.session && (
            <Link href={"/login"} passHref>
              <IconButton className={classes["icon-button"]}>
                <ShoppingCartOutlinedIcon className={classes.icon} />
              </IconButton>
            </Link>
          )}
          {props.session && !props.session.user.image && (
            <Link href={"/cart"} passHref>
              <IconButton className={classes["icon-button"]}>
                <ShoppingCartOutlinedIcon className={classes.icon} />
              </IconButton>
            </Link>
          )}
          {props.session && props.session.user.image && (
            <Link href="/company/add_product" passHref>
              <IconButton className={classes["icon-button"]}>
                <AddIcon className={classes.icon} />
              </IconButton>
            </Link>
          )}
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
