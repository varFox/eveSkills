/* eslint-disable no-underscore-dangle */
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import reducers from './reducers';

const composeEnhancers =
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__)
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose; 

let state;
if (typeof window !== 'undefined') {
  state = window.__PRELOADED_STATE__;
  delete window.__PRELOADED_STATE__;
}

const store = createStore(
  reducers,
  state,
  composeEnhancers(applyMiddleware(thunk))
);

export { store };
