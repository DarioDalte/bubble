import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { signIn, getSession } from "next-auth/client";
import classes from "./login.module.scss";

import useInput from "../../components/hooks/use-input";
import Button from "../../UI/Button/Button";
import PasswordTextField from "../../UI/PasswordTextField/PasswordTextField";
import Loading from "../../UI/loading/Loading";

import TextField from "@mui/material/TextField";
import useMediaQuery from "@mui/material/useMediaQuery";

export default function Login() {
  const [msgError, setMsgError] = useState("");
  const regExpL = /[a-zA-Z]/g;
  const regExpN = /[0-9]/g;
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width:47rem)");

  const {
    value: enteredPassword,
    valueIsValid: passwordIsValid,
    hasError: passwordHasError,
    valueHandler: passwordHandler,
    inputBlur: passwordBlurHandler,
    inputFocus: passwordFocusHandler,
    reset: passwordReset,
    focussing: passwordFocussing
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
    inputFocus: emailFocusHandler,
    reset: emailReset,
    focussing: emailFocussing
  } = useInput(
    (email) =>
      email.includes("@") && email.includes(".") && email.trim().length > 6
  );

  const loginHandler = async (e) => {
    e.preventDefault();
    emailBlurHandler();
    passwordBlurHandler();

    if (passwordIsValid && emailIsValid) {
      setIsLoading(true);
      const result = await signIn("credentials", {
        redirect: false,
        email: enteredEmail,
        password: enteredPassword,
      });

      if (!result.error) {
        router.push("../");
      } else {
        setMsgError(result.error);
      }
    }
    setIsLoading(false);
  };



  return (
    <div className={classes.container}>
      <Loading open={isLoading} />

      <h1 className={classes.title}>
        Bentornato su <br />
        <span>Bubble!</span>
      </h1>

      <div className={classes["input-container"]}>
        {msgError && <h3 className={classes["msg-error"]}>{msgError}</h3>}
        <TextField
          id="outlined-basic"
          label="Email"
          variant="outlined"
          className={classes.input}
          value={enteredEmail}
          onChange={emailHandler}
          onBlur={emailBlurHandler}
          error={emailHasError}
          onFocus={emailFocusHandler}
        />

        <PasswordTextField
          className={classes.input}
          onChange={passwordHandler}
          onBlur={passwordBlurHandler}
          error={passwordHasError}
          onFocus={passwordFocusHandler}
        />

        <Button className={classes.button} onClick={loginHandler} />
      </div>

      {isMobile && !emailFocussing && !passwordFocussing && (
        <div className={classes.footer}>
          <Link href="http://www.google.it">
            <a className={classes["bottom-text"]}>Password dimenticata?</a>
          </Link>
          <Link href="http://www.google.it">
            <a className={classes["bottom-text"]}>Registrati</a>
          </Link>
        </div>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });

  if (session) {
    return {
      redirect: {
        destination: "../",
        permanent: false,
      },
    };
  }
  return { props: {} };
}
