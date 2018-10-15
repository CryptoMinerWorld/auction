import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './app/App';
import store from './app/store';
import { getAuctions } from './features/market/marketActions';
import { getCurrentUser } from './features/auth/authActions';
import { Provider as UnstatedProvider } from 'unstated';

// @notice these are all the actions fired when the app starts up
store.dispatch(getCurrentUser());
store.dispatch(getAuctions());

// eslint-disable-next-line
const Bundle = () => (
  <Provider store={store}>
    <UnstatedProvider>
      <App />
    </UnstatedProvider>
  </Provider>
);

ReactDOM.render(<Bundle />, document.getElementById('root'));
