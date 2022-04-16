import classes from "./products.module.scss";
import { useState } from "react";

import Header from "../../components/Header/Header";
import Card from "../../UI/Card/Card";
import BottomNav from "../../components/BottomNav/BottomNav";

import { getSession } from "next-auth/client";

import useMediaQuery from "@mui/material/useMediaQuery";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Radio from "@mui/material/Radio";
import FormControlLabel from "@mui/material/FormControlLabel";
import Divider from "@mui/material/Divider";
import RadioGroup from "@mui/material/RadioGroup";

function Products(props) {
  const isMobile = useMediaQuery("(max-width:47rem)");
  const [filterName, setFilterName] = useState(-1);
  const [filterPrice, setFilterPrice] = useState(-1);
  const [filterRating, setFilterRating] = useState(-1);

  return (
    <>
      <Header session={props.session} />
      <div className={classes.body}>
        {!isMobile && (
          <div className={classes["filter-container"]}>
            <h3 className={classes.title}>Prezzo</h3>
            <div className={classes["price-container"]}>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-amount">Min</InputLabel>
                <OutlinedInput
                  type="number"
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">€</InputAdornment>
                  }
                  label="Prezzo"
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel htmlFor="outlined-adornment-amount">Max</InputLabel>
                <OutlinedInput
                  type="number"
                  id="outlined-adornment-amount"
                  startAdornment={
                    <InputAdornment position="start">€</InputAdornment>
                  }
                  label="Prezzo"
                />
              </FormControl>
            </div>
            <h3 style={{ marginTop: "2rem" }} className={classes.title}>
              Ordina per
            </h3>
            <RadioGroup
              onChange={(e) => {
                setFilterName(e.target.value);
              }}
              value={filterName}
            >
              {" "}
              <FormControlLabel
                className={classes.radio}
                value={0}
                control={<Radio />}
                label="Nome (A-Z)"
                labelPlacement="start"
              />
              <Divider />
              <FormControlLabel
                className={classes.radio}
                value={1}
                control={<Radio />}
                label="Nome (Z-A)"
                labelPlacement="start"
              />
            </RadioGroup>
            <RadioGroup
              sx={{ marginTop: "2rem" }}
              onChange={(e) => {
                setFilterPrice(e.target.value);
              }}
              value={filterPrice}
            >
              {" "}
              <FormControlLabel
                className={classes.radio}
                value={0}
                control={<Radio />}
                label="Prezzo crescente"
                labelPlacement="start"
              />
              <Divider />
              <FormControlLabel
                className={classes.radio}
                value={1}
                control={<Radio />}
                label="Prezzo decrescente"
                labelPlacement="start"
              />
            </RadioGroup>
            <RadioGroup
              sx={{ marginTop: "2rem" }}
              onChange={(e) => {
                setFilterRating(e.target.value);
              }}
              value={filterRating}
            >
              {" "}
              <FormControlLabel
                className={classes.radio}
                value={0}
                control={<Radio />}
                label="Valutazione crescente"
                labelPlacement="start"
              />
              <Divider />
              <FormControlLabel
                className={classes.radio}
                value={1}
                control={<Radio />}
                label="Valutazione decrescente"
                labelPlacement="start"
              />
            </RadioGroup>

            <input
              type="button"
              value={"Reset"}
              className={classes.btn}
              onClick={() => {
                setFilterRating(-1);
                setFilterPrice(-1);
                setFilterName(-1);
              }}
            />
          </div>
        )}

        <div className={classes["products-container"]}>
          {props.products.map((product, i) => {
            if (i < 20) {
              return (
                <Card
                  key={i}
                  className={classes.card}
                  name={
                    product.name.charAt(0).toUpperCase() + product.name.slice(1)
                  }
                  price={product.price}
                  brand={"Logitech"}
                  star={product.star}
                  path={`/${product.image}`}
                />
              );
            }
          })}
        </div>
      </div>
      {isMobile && <BottomNav navValue={-1} />}
    </>
  );
}

export default Products;

export async function getServerSideProps(ctx) {
  const databaseConnection = require("../api/middlewares/database.js");
  const session = await getSession({ req: ctx.req });

  const client = await databaseConnection();
  await client.connect();
  const db = client.db();

  const products = await db.collection("products").find().toArray();
  //   console.log(products);

  return {
    props: {
      products: JSON.parse(JSON.stringify(products)),
      session: session,
    }, // will be passed to the page component as props
  };
}
