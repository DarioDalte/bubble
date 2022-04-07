import classes from "./Stepper.module.scss";

import * as React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { signIn } from "next-auth/client";
import { useRouter } from "next/router";

import { styled } from "@mui/material/styles";
import {
  Stack,
  Stepper,
  Step,
  StepLabel,
  Button,
  useMediaQuery,
  TextField,
} from "@mui/material";
import Check from "@mui/icons-material/Check";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";

import useInput from "../../../components/hooks/use-input";
import PasswordTextField from "../../../UI/PasswordTextField/PasswordTextField";
import Loading from "../../../UI/Loading/Loading";
import ButtonOutlined from "../../../UI/ButtonOutlined/ButtonOutlined";
import CountrySelect from "../../../UI/CountrySelector/CountrySelectro";

const QontoConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 10,
    left: "calc(-50% + 16px)",
    right: "calc(50% + 16px)",
  },
  [`&.${stepConnectorClasses.active}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#3669c9",
    },
  },
  [`&.${stepConnectorClasses.completed}`]: {
    [`& .${stepConnectorClasses.line}`]: {
      borderColor: "#3669c9",
    },
  },
  [`& .${stepConnectorClasses.line}`]: {
    borderColor:
      theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
    borderTopWidth: 3,
    borderRadius: 1,
  },
}));

const QontoStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  color: theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
  display: "flex",
  height: 22,
  alignItems: "center",
  ...(ownerState.active && {
    color: "#3669c9",
  }),
  "& .QontoStepIcon-completedIcon": {
    color: "#3669c9",
    zIndex: 1,
    fontSize: 18,
  },
  "& .QontoStepIcon-circle": {
    width: 8,
    height: 8,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
}));

function QontoStepIcon(props) {
  const { active, completed, className } = props;
  const [activeStep, setActiveStep] = React.useState(0);

  return (
    <QontoStepIconRoot ownerState={{ active }} className={className}>
      {completed ? (
        <Check className="QontoStepIcon-completedIcon" />
      ) : (
        <div className="QontoStepIcon-circle" />
      )}
    </QontoStepIconRoot>
  );
}

QontoStepIcon.propTypes = {
  /**
   * Whether this step is active.
   * @default false
   */
  active: PropTypes.bool,
  className: PropTypes.string,
  /**
   * Mark the step as completed. Is passed to child components.
   * @default false
   */
  completed: PropTypes.bool,
};

export default function CustomizedSteppers() {
  const [activeStep, setActiveStep] = React.useState(0);
  const [skipped, setSkipped] = React.useState(new Set());
  const [msgError, setMsgError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [privateUser, setPrivateUser] = React.useState(null);
  const [inputFocussing, setInputFocussing] = React.useState(false);
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width:47rem)");
  const regExpL = /[A-Z]/g;
  const regExpN = /[0-9]/g;
  const regExpM = /[a-z]/g;
  const regExpML = /[a-zA-z]/g;

  let steps = [
    "Anagrafica",
    "Indirizzo di fatturazione",
    "Metodo di pagamento",
  ];

  if (!privateUser) {
    steps = ["Anagrafica", "Dati aziendali", "Indirizzo sede legale"];
  }

  const {
    value: enteredEmail,
    valueIsValid: emailIsValid,
    hasError: emailHasError,
    valueHandler: emailHandler,
    inputBlur: emailBlurHandler,
    inputFocus: emailFocusHandler,
    reset: emailReset,
    focussing: emailFocussing,
  } = useInput(
    (email) =>
      email.includes("@") && email.includes(".") && email.trim().length > 6
  );

  const {
    value: enteredName,
    valueIsValid: nameIsValid,
    hasError: nameHasError,
    valueHandler: nameHandler,
    inputBlur: nameBlurHandler,
    inputFocus: nameFocusHandler,
    reset: nameReset,
    focussing: nameFocussing,
  } = useInput((name) => regExpM.test(name));

  const {
    value: enteredPassword,
    valueIsValid: passwordIsValid,
    hasError: passwordHasError,
    valueHandler: passwordHandler,
    inputBlur: passwordBlurHandler,
    inputFocus: passwordFocusHandler,
    reset: passwordReset,
    focussing: passwordFocussing,
  } = useInput(
    (password) =>
      password.trim().length >= 6 &&
      regExpN.test(password) &&
      regExpL.test(password) &&
      regExpM.test(password)
  );

  const {
    value: enteredRagioneSociale,
    valueIsValid: ragioneSocialeIsValid,
    hasError: ragioneSocialeHasError,
    valueHandler: ragioneSocialeHandler,
    inputBlur: ragioneSocialeBlurHandler,
    inputFocus: ragioneSocialeFocusHandler,
    reset: ragioneSocialeReset,
    focussing: ragioneSocialeFocussing,
  } = useInput(
    (ragioneSociale) =>
      regExpML.test(ragioneSociale) && ragioneSociale.trim().length >= 5
  );

  const {
    value: enteredPIva,
    valueIsValid: pIvaIsValid,
    hasError: pIvaHasError,
    valueHandler: pIvaHandler,
    inputBlur: pIvaBlurHandler,
    inputFocus: pIvaFocusHandler,
    reset: pIvaReset,
    focussing: pIvaFocussing,
  } = useInput((pIva) => regExpN.test(pIva) && pIva.trim().length === 11);

  const focusBlurHandler = () => {
    setInputFocussing((focussing) => !focussing);
  };

  //!Problema con:
  /**
   * password.trim().length >= 6 &&
      regExpN.test(password) &&
      regExpL.test(password) &&
      regExpM.test(password) &&
      verifyPassword === enteredPassword
   */ //!Non ho capito il perchè :/
  const {
    value: enteredVerifyPassword,
    valueIsValid: verifyPasswordIsValid,
    hasError: verifyPasswordHasError,
    valueHandler: verifyPasswordHandler,
    inputBlur: verifyPasswordBlurHandler,
    inputFocus: verifyPasswordFocusHandler,
    reset: verifyPasswordReset,
    focussing: verifyPasswordFocussing,
  } = useInput((verifyPassword) => verifyPassword === enteredPassword);

  const {
    value: enteredCity,
    valueIsValid: cityIsValid,
    hasError: cityHasError,
    valueHandler: cityHandler,
    inputBlur: cityBlurHandler,
    inputFocus: cityFocusHandler,
    reset: cityReset,
    focussing: cityFocussing,
  } = useInput((city) => city.trim().length >= 4 && !regExpN.test(city));

  const {
    value: enteredCap,
    valueIsValid: capIsValid,
    hasError: capHasError,
    valueHandler: capHandler,
    inputBlur: capBlurHandler,
    inputFocus: capFocusHandler,
    reset: capReset,
    focussing: capFocussing,
  } = useInput((cap) => cap.trim().length === 5);

  const {
    value: enteredProvincia,
    valueIsValid: provinciaIsValid,
    hasError: provinciaHasError,
    valueHandler: provinciaHandler,
    inputBlur: provinciaBlurHandler,
    inputFocus: provinciaFocusHandler,
    reset: provinciaReset,
    focussing: provinciaFocussing,
  } = useInput(
    (provincia) => provincia.trim().length >= 4 && !regExpN.test(provincia)
  );

  const {
    value: enteredAddress,
    valueIsValid: addressIsValid,
    hasError: addressHasError,
    valueHandler: addressHandler,
    inputBlur: addressBlurHandler,
    inputFocus: addressFocusHandler,
    reset: addressReset,
    focussing: addressFocussing,
  } = useInput(
    (address) =>
      address.trim().length >= 5 &&
      regExpML.test(address) &&
      regExpN.test(address)
  );

  const login = async () => {
    const result = await signIn("credentials", {
      redirect: false,
      email: enteredEmail,
      password: enteredPassword,
    });

    if (!result.error) {
      setMsgError("");
      router.push("../");
    } else {
      setMsgError(result.error);
      setIsLoading(false);
    }
  };

  const isStepOptional = (step) => {
    return step === 2 || step === 1;
  };

  const isStepSkipped = (step) => {
    return skipped.has(step);
  };

  const handleNext = () => {
    let newSkipped = skipped;

    if (activeStep === steps.length - 1) {
      setIsLoading(true);
      let data = {};
      let address = {};
      if (privateUser) {
        address = {
          city: enteredCity,
          cap: enteredCap,
          province: enteredProvincia,
          street: enteredAddress,
        };

        address = Object.fromEntries(
          Object.entries(address).filter(([_, v]) => v != "")
        );

        data = {
          name: enteredName,
          password: enteredPassword,
          email: enteredEmail,
          address: address,
        };
      }

      data = Object.fromEntries(
        Object.entries(data).filter(
          ([_, v]) => v != "" && JSON.stringify(v) != "{}"
        )
      );
      axios.post(`/api/registration`, data).then((res) => {
        if (!res.data.status) {
          setMsgError(res.data.message);
          setActiveStep(0);
          setIsLoading(false);
        } else {
          login();
        }
      });
    } else {
      if (isStepSkipped(activeStep)) {
        newSkipped = new Set(newSkipped.values());
        newSkipped.delete(activeStep);
      }

      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      setSkipped(newSkipped);
    }
  };

  const handleBack = () => {
    if (activeStep === 0) {
      setPrivateUser(null);
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    }
  };

  const handleSkip = () => {
    if (!isStepOptional(activeStep)) {
      // You probably want to guard against something like this,
      // it should never occur unless someone's actively trying to break something.
      throw new Error("You can't skip a step that isn't optional.");
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped((prevSkipped) => {
      const newSkipped = new Set(prevSkipped.values());
      newSkipped.add(activeStep);
      return newSkipped;
    });
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  if (privateUser === null) {
    return (
      <div className={classes["intro-container"]}>
        <h3 className={classes.title}>Tipologia di account</h3>
        <div className={classes["btn-container"]}>
          <ButtonOutlined
            value={"Privato"}
            className={classes.red}
            onClick={() => {
              setPrivateUser(true);
            }}
          />
          <ButtonOutlined
            value={"Aziendale"}
            className={classes.green}
            onClick={() => {
              setPrivateUser(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <Stack sx={{ width: "100%", marginTop: "1rem" }} spacing={4}>
      <Stepper
        alternativeLabel
        activeStep={activeStep}
        connector={<QontoConnector />}
      >
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length ? (
        <React.Fragment>Dati inviati correttamente</React.Fragment>
      ) : (
        <React.Fragment>
          <div className={classes.container}>
            <Loading open={isLoading} />
            <h2 className={classes.title}>{steps[activeStep]}</h2>
            {msgError && activeStep === 0 && (
              <h3 className={classes.error}>{msgError}</h3>
            )}

            <div className={classes["input-container"]}>
              {activeStep === 0 && (
                <>
                  <TextField
                    label={privateUser ? "Nome completo" : "Nome mostrato"}
                    variant="outlined"
                    className={classes.input}
                    value={enteredName}
                    onChange={nameHandler}
                    onBlur={nameBlurHandler}
                    error={nameHasError}
                    onFocus={nameFocusHandler}
                    required
                  />

                  <TextField
                    label="Email"
                    variant="outlined"
                    className={classes.input}
                    value={enteredEmail}
                    onChange={emailHandler}
                    onBlur={emailBlurHandler}
                    error={emailHasError}
                    onFocus={emailFocusHandler}
                    required
                  />

                  <PasswordTextField
                    text="Password"
                    value={enteredPassword}
                    className={classes.input}
                    onChange={passwordHandler}
                    onBlur={passwordBlurHandler}
                    error={passwordHasError}
                    onFocus={passwordFocusHandler}
                    required={true}
                  />
                  <PasswordTextField
                    text="Conferma password"
                    value={enteredVerifyPassword}
                    className={classes.input}
                    onChange={verifyPasswordHandler}
                    onBlur={verifyPasswordBlurHandler}
                    error={verifyPasswordHasError}
                    onFocus={verifyPasswordFocusHandler}
                    required={true}
                  />
                </>
              )}

              {activeStep == 1 && !privateUser && (
                <>
                  {" "}
                  <TextField
                    className={classes["input-address"]}
                    label="Ragione sociale"
                    variant="outlined"
                    value={enteredRagioneSociale}
                    onChange={ragioneSocialeHandler}
                    onBlur={ragioneSocialeBlurHandler}
                    error={!privateUser ? ragioneSocialeHasError : false}
                    onFocus={ragioneSocialeFocusHandler}
                    required={!privateUser}
                  />
                  <TextField
                    className={classes["input-address"]}
                    label="Partita Iva"
                    variant="outlined"
                    value={enteredPIva}
                    onChange={pIvaHandler}
                    onBlur={pIvaBlurHandler}
                    error={!privateUser ? pIvaHasError : false}
                    onFocus={pIvaFocusHandler}
                    required={!privateUser}
                    type={"number"}
                    length={5}
                    onInput={(e) => {
                      e.target.value = Math.max(0, parseInt(e.target.value))
                        .toString()
                        .slice(0, 11);
                    }}
                  />
                </>
              )}

              {((activeStep === 2 && !privateUser) ||
                (activeStep === 1 && privateUser)) && (
                <>
                  <CountrySelect
                    classes={classes["input-address"]}
                    onFocus={focusBlurHandler}
                    onBlur={focusBlurHandler}
                    required={!privateUser}
                  />

                  <div className={classes["input-same-line"]}>
                    <TextField
                      label={"Città"}
                      variant="outlined"
                      className={classes.city}
                      value={enteredCity}
                      onChange={cityHandler}
                      onBlur={cityBlurHandler}
                      error={!privateUser ? cityHasError : false}
                      onFocus={cityFocusHandler}
                      required={!privateUser}
                    />

                    <TextField
                      className={classes["cap"]}
                      label="Cap"
                      variant="outlined"
                      type={"number"}
                      length={5}
                      onInput={(e) => {
                        e.target.value = Math.max(0, parseInt(e.target.value))
                          .toString()
                          .slice(0, 5);
                      }}
                      value={enteredCap}
                      onChange={capHandler}
                      onBlur={capBlurHandler}
                      error={!privateUser ? capHasError : false}
                      onFocus={capFocusHandler}
                      required={!privateUser}
                    />
                  </div>
                  <TextField
                    className={classes["input-address"]}
                    label="Provincia"
                    variant="outlined"
                    value={enteredProvincia}
                    onChange={provinciaHandler}
                    onBlur={provinciaBlurHandler}
                    error={!privateUser ? provinciaHasError : false}
                    onFocus={provinciaFocusHandler}
                    required={!privateUser}
                  />
                  <TextField
                    className={classes["input-address"]}
                    label="Via e civico"
                    variant="outlined"
                    value={enteredAddress}
                    onChange={addressHandler}
                    onBlur={addressBlurHandler}
                    error={!privateUser ? addressHasError : false}
                    onFocus={addressFocusHandler}
                    required={!privateUser}
                  />
                </>
              )}
            </div>

            {(isMobile ? !emailFocussing : true) &&
              (isMobile ? !passwordFocussing : true) &&
              (isMobile ? !nameFocussing : true) &&
              (isMobile ? !verifyPasswordFocussing : true) &&
              (isMobile ? !cityFocussing : true) &&
              (isMobile ? !capFocussing : true) &&
              (isMobile ? !addressFocussing : true) &&
              (isMobile ? !provinciaFocussing : true) &&
              (isMobile ? !inputFocussing : true) && (
                <div className={classes["footer"]}>
                  <Button color="inherit" onClick={handleBack}>
                    Indietro
                  </Button>
                  <Button
                    disabled={
                      activeStep === 0
                        ? !(
                            nameIsValid &&
                            emailIsValid &&
                            passwordIsValid &&
                            verifyPasswordIsValid
                          )
                        : activeStep === 1
                        ? !privateUser
                          ? !(ragioneSocialeIsValid && pIvaIsValid)
                          : false
                        : activeStep === 2 && !privateUser
                        ? !(
                            cityIsValid &&
                            capIsValid &&
                            provinciaIsValid &&
                            addressIsValid
                          )
                        : false
                    }
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 1 ? "Invia" : "Avanti"}
                  </Button>
                </div>
              )}
          </div>
        </React.Fragment>
      )}
    </Stack>
  );
}
