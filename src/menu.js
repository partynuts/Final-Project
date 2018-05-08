import React from "react";
import { Link } from "react-router-dom";

export function Menu(props) {
  return (
    <div class="menuBar">
      <div className="headerMenuLinks">
        <p onClick={props.logout}>Logout</p>
      </div>
      <div className="headerMenuLinks">
        <a href="/friendslist"> Friends </a>
      </div>
      <div className="headerMenuLinks">
        <a href="/chat"> Chat </a>
      </div>
    </div>
  );
}
