import { useState } from "react";

import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function PasswordTextField(props) {
  const [values, setValues] = useState({ showPassword: false });
  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <FormControl variant="outlined" className={props.className}>
      <InputLabel htmlFor="outlined-adornment-password" error={props.error} required={props.required}>
        {props.text}
      </InputLabel>
      <OutlinedInput
        type={values.showPassword ? "text" : "password"}
        value={props.value}
        onChange={props.onChange}
        onBlur={props.onBlur}
        error={props.error}
        onFocus={props.onFocus}
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
        label={props.text}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            props.onEnter();
          }
        }}
      />
    </FormControl>
  );
}

export default PasswordTextField;
