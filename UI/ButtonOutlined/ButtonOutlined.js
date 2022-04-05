import React from 'react'
import classes from './ButtonOutlined.module.scss'

function ButtonOutlined(props) {
  return (
    <input type='button' value={props.value} className={`${props.className} ${classes.button}`} onClick={props.onClick}/>
  )
}

export default ButtonOutlined