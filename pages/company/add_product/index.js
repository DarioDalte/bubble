import classes from "./addProduct.module.scss";
import { getSession } from "next-auth/client";
import { useState } from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Phone from "../../../components/Company/AddProduct/Phone";


function AddProduct() {
  const [typology, setTypology] = useState(null);

  const handleChange = (event) => {
    setTypology(event.target.value);
  };

  return (
    <>
    <h3 className={classes.title} >Aggiungi un prodotto!</h3>
      <div className={classes["select-container"]}>
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">Tipologia</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={typology}
            label="Tipologia"
            onChange={handleChange}
          >
            <MenuItem value={'phone'}>Telefoni</MenuItem>
            <MenuItem value={'computer'}>Computer</MenuItem>
          </Select>
        </FormControl>
      </div>
      {typology === 'phone' && <Phone/>}
    </>
  );
}

export default AddProduct;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (!session || !session.user.image) {
    return {
      redirect: {
        destination: "../",
        permanent: false,
      },
    };
  }
  return { props: {} };
}
