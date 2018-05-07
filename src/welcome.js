import React from "react";
import { Register } from "./register";
import { Logo } from "./logo.js";
import { Login } from "./login.js";
import { HashRouter, Route } from "react-router-dom";

export function Welcome(props) {
  return (
    <div className="wlcmBody">
      <div className="headings">
        <Logo />
        <h1>Spread nature, swap plants!</h1>
        <h3>
          Meet like-minded green-thumbed pals to trade plants, swap tips and
          share pictures of your green treasures. Sign up to connect with other
          plant-lovers around the world.
        </h3>

        <HashRouter>
          <div className="forms">
            <Route exact path="/" component={Register} />
            <Route path="/login" component={Login} />
          </div>
        </HashRouter>
      </div>
    </div>
  );
}
