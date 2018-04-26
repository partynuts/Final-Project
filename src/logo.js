import React from "react";
import axios from "../axios";

export function Logo(props) {
  return (
    <div className="logo">
      <img id="logo"  className={props.small} src="/plantswap.png"/>
    </div>
  )

}
