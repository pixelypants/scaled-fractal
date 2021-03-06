// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { ConnectedRouter, routerMiddleware } from 'connected-react-router';

import reducers from '@core/reducers';
import rootDomTag from '@pkgs/root-dom-tag';

import App from './App';

// Create history object for tracking routes
const history = createBrowserHistory();

// Create middleware required for all builds
const middleware = [
  thunk,
  routerMiddleware(history),
];

// Function to start the rendering of the GUI
const startApp = () => {
  const composeEnhancers = (
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ // eslint-disable-line no-underscore-dangle
    || compose
  );

  const store = createStore(
    reducers(history),
    composeEnhancers(
      applyMiddleware(...middleware),
    ),
  );

  const Main = () => (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <App />
      </ConnectedRouter>
    </Provider>
  );

  const domNode = document.getElementById(rootDomTag);
  if (domNode) {
    ReactDOM.render(
      <Main />,
      domNode,
    );
  } else {
    console.error(`Element id ${rootDomTag} could not be found`);
  }
};

// Check if the process is production mode and if it is not
// do not include redux logger into the build
if (process.env.NODE_ENV !== 'production') {
  import(/* webpackChunkName: "logger" */ 'redux-logger').then((module) => {
    middleware.push(
      module.createLogger({
        collapsed: true,
      }),
    );
    startApp();
  });
} else {
  startApp();
}
