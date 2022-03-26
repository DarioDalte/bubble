import React from 'react'
import classes from './Button.module.scss'

function Button(props) {
  return (
    <input type='button' value='Log-In' className={`${props.classes} ${classes.button}`} onClick={props.onClick}/>
  )
}

export default Button