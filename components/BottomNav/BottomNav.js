import { useState } from "react";
import Link from "next/link";

import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";

import HomeIcon from "@mui/icons-material/Home";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import PersonIcon from "@mui/icons-material/Person";

import classes from "./BottomNav.module.scss";

function BottomNav(props) {
  const [navValue, setNavValue] = useState(props.navValue);
  //console.log(navValue);

  return (
    <BottomNavigation
      className={classes.layout}
      showLabels
      value={navValue}
      onChange={(event, newValue) => {
        setNavValue(newValue);
      }}
    >
      <BottomNavigationAction label="Home" icon={<HomeIcon />} />
      <BottomNavigationAction label="Wishlist" icon={<FavoriteIcon />} />
      <BottomNavigationAction label="Ordini" icon={<ShoppingBagIcon />} />

      <BottomNavigationAction
        label="Profilo"
        icon={<PersonIcon />}
        href="/profile"
      />
    </BottomNavigation>
  );
}

export default BottomNav;
