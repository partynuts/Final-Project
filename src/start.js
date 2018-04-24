
import React from 'react';
import ReactDOM from 'react-dom';
import {Welcome} from './welcome.js';
import {Login} from './login.js';
import {Register} from './register.js';
import {Logo} from './logo.js';

let component;

if (location.pathname == '/welcome') {
  component = <Welcome />;
} else {
  component = <Logo />;

}


ReactDOM.render(
  component,
    document.querySelector('main')
);
