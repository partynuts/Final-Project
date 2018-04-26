import React from 'react';
import {Register} from './register';
import {Logo} from './logo.js';
import {Login} from './login.js';
import {HashRouter, Route} from 'react-router-dom';



export function Welcome(props) {
  return (
    <div className="wlcmBody">
      <div className="headings">
        <Logo />
        <h1>Spread nature, swap plants!</h1>
        <h3>Please register to make friends with other plant lovers.</h3>


        <HashRouter>
          <div className="forms" style={formStyle}>
            <Route exact path="/" component={Register} />
            <Route path="/login" component={Login} />
          </div>
        </HashRouter>
      </div>
    </div>
  );
}
