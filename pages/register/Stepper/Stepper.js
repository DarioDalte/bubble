import classes from "./Stepper.module.scss";
import * as React from "react";
import PropTypes from "prop-types";
import { styled } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Check from "@mui/icons-material/Check";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

import useInput from "../../../components/hooks/use-input";
import ButtonFilled from "../../../UI/Button/Button";
import PasswordTextField from "../../../UI/PasswordTextField/PasswordTextField";
import Loading from "../../../UI/Loading/Loading";
import ButtonOutlined from "../../../UI/ButtonOutlined/ButtonOutlined";

import { useMediaQuery, TextField } from "@mui/material";

import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
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
  const [privateUser, setPrivateUser] = React.useState(null);
  const regExpL = /[A-Z]/g;
  const regExpN = /[0-9]/g;
  const regExpM = /[a-z]/g;
  const regExpML = /[a-zA-z]/g;

  let steps = ["Anagrafica", "Residenza", "Metodo di pagamento"];

  if (!privateUser) {
    steps = ["Anagrafica", "Dati aziendali"];
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

  const loginHandler = async (e) => {
    if (e) {
      e.preventDefault();
    }
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
        setMsgError("");
        router.push("../");
      } else {
        setMsgError(result.error);
        setIsLoading(false);
      }
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
    if (isStepSkipped(activeStep)) {
      newSkipped = new Set(newSkipped.values());
      newSkipped.delete(activeStep);
    }

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);
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
        <h3 className={classes.title}>Sei un&apos;azienda?</h3>
        <div className={classes["btn-container"]}>
          <ButtonOutlined
            value={"No"}
            className={classes.red}
            onClick={() => {
              setPrivateUser(true);
            }}
          />
          <ButtonOutlined
            value={"Si"}
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
        <React.Fragment>
          Dati inviati correttamente
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className={classes.container}>
            <h3 className={classes.title}>{steps[activeStep]}</h3>

            <div className={classes["input-container"]}>
              {activeStep === 0 && (
                <>
                  <TextField
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    className={classes.input}
                    value={enteredName}
                    onChange={nameHandler}
                    onBlur={nameBlurHandler}
                    error={nameHasError}
                    onFocus={nameFocusHandler}
                  />

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
                    text="Password"
                    value={enteredPassword}
                    className={classes.input}
                    onChange={passwordHandler}
                    onBlur={passwordBlurHandler}
                    error={passwordHasError}
                    onFocus={passwordFocusHandler}
                  />
                  <PasswordTextField
                    text="Conferma"
                    value={enteredVerifyPassword}
                    className={classes.input}
                    onChange={verifyPasswordHandler}
                    onBlur={verifyPasswordBlurHandler}
                    error={verifyPasswordHasError}
                    onFocus={verifyPasswordFocusHandler}
                  />
                </>
              )}

              {activeStep === 1 && (
                <div className={classes["input-container"]}>
                  <CountrySelect className={classes.input}/>
                </div>
              )}
            </div>

            <div className={classes["footer"]}>
              <Button color="inherit" onClick={handleBack}>
                Indietro
              </Button>

              {privateUser && isStepOptional(activeStep) && (
                <Button color="inherit" onClick={handleSkip} sx={{ mr: 1 }}>
                  Salta
                </Button>
              )}

              <Button
                disabled={
                  (
                    nameIsValid &&
                    emailIsValid &&
                    passwordIsValid &&
                    verifyPasswordIsValid
                  )
                }
                
                onClick={handleNext}
              >
                {activeStep === steps.length - 1 ? "Invia" : "Avanti"}
              </Button>
            </div>
          </div>
        </React.Fragment>
      )}
    </Stack>
  );
}
