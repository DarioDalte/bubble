import Link from "next/link";
import classes from "./Category.module.scss";
import useMediaQuery from "@mui/material/useMediaQuery";

function Category(props) {
  const isMobile = useMediaQuery("(max-width:47rem)");

  return (
    <Link href={`/products/${props.title}`} passHref>
      <div className={`${classes.container} ${props.classes} `}>
        <div
          className={` ${classes.category} ${!isMobile && classes.hover}`}
          style={{ background: props.color }}
        >
          {props.icon}
        </div>
        {props.title}
      </div>
    </Link>
  );
}

export default Category;
