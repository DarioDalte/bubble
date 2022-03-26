import { useState } from "react";
import Link from "next/link";

import useInput from "../../components/hooks/use-input";
import Button from "../../UI/SearchBar/Button/Button";

import classes from "./login.module.scss";

import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const [values, setValues] = useState({ showPassword: false });
  const [msgError, setMsgError] = useState("");
  const regExpL = /[a-zA-Z]/g;
  const regExpN = /[0-9]/g;

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const {
    value: enteredPassword,
    valueIsValid: passwordIsValid,
    hasError: passwordHasError,
    valueHandler: passwordHandler,
    inputBlur: passwordBlurHandler,
    reset: passwordReset,
  } = useInput(
    (password) =>
      password.trim().length >= 6 &&
      regExpN.test(password) &&
      regExpL.test(password)
  );

  const {
    value: enteredEmail,
    valueIsValid: emailIsValid,
    hasError: emailHasError,
    valueHandler: emailHandler,
    inputBlur: emailBlurHandler,
    reset: emailReset,
  } = useInput(
    (email) =>
      email.includes("@") && email.includes(".") && email.trim().length > 6
  );

  const loginHandler = (e) => {
    e.preventDefault();
    emailBlurHandler();
    passwordBlurHandler();
    console.log("mmh mica giusto");

    if (passwordIsValid && emailIsValid) {
      console.log("tutto giusto");
      let data = {
        email: enteredEmail,
        password: enteredPassword,
      };
    }
  };
  return (
    <div className={classes.container}>
      <h1 className={classes.title}>
        Bentornato su <br />
        <span>Bubble!</span>
      </h1>
      <div className={classes["input-container"]}>
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          className={classes.input}
          value={enteredEmail}
          onChange={emailHandler}
          onBlur={emailBlurHandler}
          error={emailHasError}
        />

        <FormControl
          variant="outlined"
          className={classes.input}
        >
          <InputLabel htmlFor="outlined-adornment-password" error={passwordHasError}>
            Password
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-password"
            type={values.showPassword ? "text" : "password"}
            value={values.password}
            onChange={passwordHandler}
            onBlur={passwordBlurHandler}
            error={passwordHasError}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <Button onClick={loginHandler} />
      </div>

      <div className={classes.footer}>
        <Link href="http://www.google.it">
          <span className={classes["bottom-text"]}>Password dimenticata?</span>
        </Link>
        <Link href="http://www.google.it">
          <span className={classes["bottom-text"]}>Registrati</span>
        </Link>
      </div>
    </div>
  );
}
