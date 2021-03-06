import classes from "./addProduct.module.scss";
import { getSession } from "next-auth/client";
import { useState } from "react";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Phone from "../../../components/Company/AddProduct/Phone";
import BackArrow from "../../../UI/BackArrow/BackArrow";
import Head from "next/head";

function AddProduct(props) {
  const [typology, setTypology] = useState("");

  const handleChange = (event) => {
    setTypology(event.target.value);
  };

  return (
    <>

    <Head>
      <title>Aggiungi un prodotto</title>
    </Head>
      <BackArrow  path={`${props.prevUrl}`}/>

      <div className={classes.container}>
        <h3 className={classes.title}>Aggiungi un prodotto!</h3>
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
              <MenuItem value={"phone"}>Telefoni</MenuItem>
              <MenuItem value={"computer"}>Computer</MenuItem>
            </Select>
          </FormControl>
        </div>
        {typology === "phone" && (
          <Phone companyName={props.session.user.name} />
        )}
      </div>
    </>
  );
}

export default AddProduct;

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const prevUrl = context.req.headers.referer;

  if (!session || !session.user.image) {
    return {
      redirect: {
        destination: "../",
        permanent: false,
      },
    };
  }
  return { props: { session: session, prevUrl: prevUrl ? prevUrl : '/' } };
}
