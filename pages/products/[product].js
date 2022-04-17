import classes from "./products.module.scss";
import { useState, useEffect } from "react";
import axios from "axios";

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
import { useRouter } from "next/router";
import SentimentVeryDissatisfiedIcon from "@mui/icons-material/SentimentVeryDissatisfied";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Tab from "@mui/material/Tab";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";
import TabPanel from "@mui/lab/TabPanel";

function Products(props) {
  const isMobile = useMediaQuery("(max-width:47rem)");
  const [filterName, setFilterName] = useState(-1);
  const [filterPrice, setFilterPrice] = useState(-1);
  const [filterRating, setFilterRating] = useState(-1);
  const [value, setValue] = useState("1");

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const router = useRouter();
  const { product } = router.query;
  console.log(product);
  useEffect(() => {
    enterHandler();
  }, [product]);

  const enterHandler = () => {
    setIsLoading(true);
    axios.post("/api/ricerca", { stringa: product }).then((res) => {
      setProducts(res.data.prodotti);
      setIsLoading(false);
    });
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className={classes.modal}>
          <TabContext value={value}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange} className={classes.tabs}>
                <Tab label="Filtra" value="1" />
                <Tab label="Ordina" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1" sx={{ padding: 0, marginTop: "3rem"}}>
              <h3 className={classes.title}>Prezzo</h3>
              <div className={classes["price-container-mobile"]}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Min
                  </InputLabel>
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
                  <InputLabel htmlFor="outlined-adornment-amount">
                    Max
                  </InputLabel>
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
              <div className={classes["btn-container"]} style={{ marginTop: "2rem" }}>
                <input
                  type="button"
                  value={"Reset"}
                  className={classes.btn}
                  style={{ width: "40%" }}
                />
                <input
                  type="button"
                  value={"Applica"}
                  className={classes["btn-apply"]}
                  onClick={handleClose}
                />
              </div>
            </TabPanel>
            <TabPanel value="2" sx={{ padding: 0, marginTop: "1.5rem" }}>
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
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 22,
                        },
                      }}
                    />
                  }
                  label="Nome (A-Z)"
                  labelPlacement="start"
                />
                <Divider />
                <FormControlLabel
                  className={classes.radio}
                  value={1}
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 22,
                        },
                      }}
                    />
                  }
                  label="Nome (Z-A)"
                  labelPlacement="start"
                />
              </RadioGroup>
              <RadioGroup
                sx={{ marginTop: "1.5rem" }}
                onChange={(e) => {
                  setFilterPrice(e.target.value);
                }}
                value={filterPrice}
              >
                {" "}
                <FormControlLabel
                  className={classes.radio}
                  value={0}
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 22,
                        },
                      }}
                    />
                  }
                  label="Prezzo crescente"
                  labelPlacement="start"
                />
                <Divider />
                <FormControlLabel
                  className={classes.radio}
                  value={1}
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 22,
                        },
                      }}
                    />
                  }
                  label="Prezzo decrescente"
                  labelPlacement="start"
                />
              </RadioGroup>
              <RadioGroup
                sx={{ marginTop: "1.5rem" }}
                onChange={(e) => {
                  setFilterRating(e.target.value);
                }}
                value={filterRating}
              >
                {" "}
                <FormControlLabel
                  className={classes.radio}
                  value={0}
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 22,
                        },
                      }}
                    />
                  }
                  label="Valutazione crescente"
                  labelPlacement="start"
                />
                <Divider />
                <FormControlLabel
                  className={classes.radio}
                  value={1}
                  control={
                    <Radio
                      sx={{
                        "& .MuiSvgIcon-root": {
                          fontSize: 22,
                        },
                      }}
                    />
                  }
                  label="Valutazione decrescente"
                  labelPlacement="start"
                />
              </RadioGroup>
              <div className={classes["btn-container"]}>
                <input
                  type="button"
                  value={"Reset"}
                  className={classes.btn}
                  style={{ width: "40%" }}
                  onClick={() => {
                    setFilterRating(-1);
                    setFilterPrice(-1);
                    setFilterName(-1);
                  }}
                />
                <input
                  type="button"
                  value={"Applica"}
                  className={classes["btn-apply"]}
                  onClick={handleClose}
                />
              </div>
            </TabPanel>
          </TabContext>
        </div>
      </Modal>
      <Header session={props.session} />
      <div
        className={classes.body}
        style={isMobile ? { marginTop: "3rem", flexDirection: "column" } : {}}
      >
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

        {isMobile && (
          <span className={classes["modal-btn"]} onClick={handleOpen}>
            Filtri
          </span>
        )}

        <div className={classes["products-container"]}>
          {!isLoading ? (
            products.length === 0 ? (
              <div className={classes["nothing-container"]}>
                <span className={classes.text}>
                  Non sono stati trovati prodotti
                </span>{" "}
                <SentimentVeryDissatisfiedIcon className={classes.icon} />
              </div>
            ) : (
              products.map((product, i) => {
                if (i < 20) {
                  return (
                    <Card
                      key={i}
                      className={classes.card}
                      name={
                        product.name.charAt(0).toUpperCase() +
                        product.name.slice(1)
                      }
                      price={product.price}
                      brand={"Logitech"}
                      star={product.star}
                      path={`/${product.image}`}
                    />
                  );
                }
              })
            )
          ) : (
            <CircularProgress className={classes.loading} />
          )}
        </div>
      </div>
      {isMobile && <BottomNav navValue={-1} />}
    </>
  );
}

export default Products;

export async function getServerSideProps(ctx) {
  const session = await getSession({ req: ctx.req });

  return {
    props: {
      session: session,
    }, // will be passed to the page component as props
  };
}
