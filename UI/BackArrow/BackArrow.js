import classes from './BackArrow.module.scss'
import Link from 'next/link'

import { IconButton} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";


function BackArrow() {
  return (
    <Link href={'/'} passHref>
        <IconButton className={classes["arrow-container"]}>
          <ArrowBackIcon className={classes.arrow} />
        </IconButton>
      </Link>
  )
}

export default BackArrow