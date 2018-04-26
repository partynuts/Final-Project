
import React from 'react';
import ReactDOM from 'react-dom';
import {Welcome} from './welcome.js';
import {Login} from './login.js';
import {Register} from './register.js';
import {Logo} from './logo.js';
import {Profile} from './profile';
import {Home} from './home';

let component;

if (location.pathname == '/welcome') {
  component = <Welcome />;
} else {
  component = <Home />;

}


ReactDOM.render(
  component,
    document.querySelector('main')
);
