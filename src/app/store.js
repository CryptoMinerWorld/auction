import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducer from './rootReducer';

const middleware = [thunk];
// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  reducer,
  /* preloadedState, */ composeEnhancers(applyMiddleware(...middleware)),
);

export default store;
