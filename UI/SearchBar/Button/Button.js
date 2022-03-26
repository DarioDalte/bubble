import React from 'react'
import classes from './Button.module.scss'

function Button(props) {
  return (
    <input type='button' value='Log-In' className={`${props.classes} ${classes.button}`}/>
  )
}

export default Button