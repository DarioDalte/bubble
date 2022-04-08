import classes from "./ProfileMenu.module.scss";
import Link from "next/link";
import { signOut, useSession } from "next-auth/client";
import { useEffect } from "react";

import PersonOutlineIcon from "@mui/icons-material/PersonOutline";

import { IconButton } from "@mui/material";

function ProfileMenu(props) {
  const [session, status] = useSession();


  const logoutHandler = () => {
    signOut();

  };

  //TODO: BORDER RADIUS primo e ultimo elemento del menu
  let content = (
    <>
      <Link href={"/login"}>
        <a className={classes.item}>Accedi</a>
      </Link>
      <Link href={"/register"}>
        <a className={classes.item}>Registrati</a>
      </Link>
    </>
  );

  if (session) {
    content = (
      <>
        <Link href={"/profile"}>
          <a className={classes.item}>Profilo</a>
        </Link>
        <p className={classes.item}>Carrello</p>
        <p className={classes.item}>Wishlist</p>
        <p className={classes.item} onClick={logoutHandler}>
          Esci
        </p>
      </>
    );
  }

  return (
    <div className={classes.dropdown}>
      <Link href={"/profile"} passHref>
        <IconButton className={props.buttonClass}>
          <PersonOutlineIcon className={props.iconClass} />
        </IconButton>
      </Link>
      <div className={classes["dropdown-content"]}>{content}</div>
    </div>
  );
}

export default ProfileMenu;
