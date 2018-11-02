import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import App from './app/App';
import store from './app/store';
import { getAuctions } from './features/market/marketActions';
import { getCurrentUser } from './features/auth/authActions';


const client = new ApolloClient({
  uri: process.env.NODE_ENV === 'development' ? 'http://localhost:4000' : 'https://dev-cryptominerworld.appspot.com/',
});


// @notice these are all the actions fired when the app starts up
store.dispatch(getCurrentUser());
store.dispatch(getAuctions());

// eslint-disable-next-line
ReactDOM.render(<Provider store={store}><ApolloProvider client={client}><App /></ApolloProvider></Provider>, document.getElementById('root'));
