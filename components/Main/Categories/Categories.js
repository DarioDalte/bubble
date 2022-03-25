import classes from "./Categories.module.scss";

import { useState } from "react";
import Modal from "@mui/material/Modal";
import Category from "./Category";
import Backdrop from "@mui/material/Backdrop";
import useMediaQuery from '@mui/material/useMediaQuery';

import PhoneAndroidOutlinedIcon from "@mui/icons-material/PhoneAndroidOutlined";
import ComputerOutlinedIcon from "@mui/icons-material/ComputerOutlined";
import SportsVolleyballOutlinedIcon from "@mui/icons-material/SportsVolleyballOutlined";
function Categories(props) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const isMobile = useMediaQuery('(max-width:37.5rem)');


  const dummy_categories = [
    {
      title: "Vestiti",
      color: "#E4F3EA",
      icon: (
        <SportsVolleyballOutlinedIcon
          className={classes.icon}
          style={{ color: "#3A9B7A" }}
        />
      ),
    },
    {
      title: "Telefoni",
      color: "#FFECE8",
      icon: (
        <PhoneAndroidOutlinedIcon
          className={classes.icon}
          style={{ color: "#FE6E4C" }}
        />
      ),
    },
    {
      title: "Computer",
      color: "#FFF6E4",
      icon: (
        <ComputerOutlinedIcon
          className={classes.icon}
          style={{ color: "#FFC120" }}
        />
      ),
    },
    {
      title: "Sport",
      color: "#F1EDFC",
      icon: (
        <SportsVolleyballOutlinedIcon
          className={classes.icon}
          style={{ color: "#9B81E5" }}
        />
      ),
    },
    {
      title: "Make-Up",
      color: "#E4F3EA",
      icon: (
        <SportsVolleyballOutlinedIcon
          className={classes.icon}
          style={{ color: "#3A9B7A" }}
        />
      ),
    },
    {
      title: "Acessori",
      color: "#E4F3EA",
      icon: (
        <SportsVolleyballOutlinedIcon
          className={classes.icon}
          style={{ color: "#3A9B7A" }}
        />
      ),
    },
  ];

  const categories = (
    <>
      {dummy_categories.map((category, i) => {
        return (
          <Category
            key={i}
            title={category.title}
            color={category.color}
            icon={category.icon}
          />
        );
      })}
    </>
  );

  return (
    <div className={props.classes}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <div className={classes.modal}>
          <h2>Categorie</h2>{" "}
          <div className={classes["modal-categories"]}>{categories}</div>
        </div>
      </Modal>


      <div className={classes.header}>
        <p className={classes.text}>Categorie</p>
        {isMobile && <p className={classes.subtext} onClick={handleOpen}>Mostra tutto</p>}
      </div>
      <div className={classes["scrolling-wrapper"]}>{categories}</div>
    </div>
  );
}

export default Categories;
