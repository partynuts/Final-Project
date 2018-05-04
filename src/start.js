
import React from 'react';
import ReactDOM from 'react-dom';
import {Welcome} from './welcome.js';
import {Login} from './login.js';
import {Register} from './register.js';
import {Logo} from './logo.js';
import {Profile} from './profile';
import {Home} from './home';

import { createStore, applyMiddleware } from 'redux';
import reduxPromise from 'redux-promise';
import reducer from './reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import {Provider} from 'react-redux';

import {init as initSocket} from './socket';


initSocket(store);

const store = createStore(reducer, composeWithDevTools(applyMiddleware(reduxPromise)));

let component;

if (location.pathname == '/welcome') {
  component = <Welcome />;
} else {
  component = (
    <Provider store={store}>
        <Home />
    </Provider>
);

}


ReactDOM.render(
  component,
    document.querySelector('main')
);
