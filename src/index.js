import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import App from './app/App';
import store from './app/store';
import { getAuctions } from './features/market/marketActions';
import { getCurrentUser } from './features/auth/authActions';
import {db} from "./app/utils/firebase";

const client = new ApolloClient({
  // uri: process.env.NODE_ENV === 'development' && 'http://localhost:4000',

  uri: 'https://cryptominerworld-7afd6.appspot.com/',

  clientState: {
    defaults: {
      userId: null,
    },
    resolvers: {},
    typeDefs: `
    type Query {
      userId: String
    }
    `,
  },

  cache: new InMemoryCache({
    // eslint-disable-next-line
    dataIdFromObject: o => (o._id ? `${o.__typename}:${o._id}` : null),
  }),
});


async function firebaseLog(log, type) {
    const newLog = db.doc(`logs/${Date.now().toString()}`)
      .set({
          logString: log,
          logType: type,
          time: new Date().toLocaleTimeString(),
      });
    //console.log("CREATE LOG:", log, type, newLog);
}

async function noop() {}

// if (process.env.NODE_ENV !== 'development') {
    console.log = (log) => noop(log, 'log');
    console.warn = (log) => noop(log, 'warn');
    console.error = (log) => noop(log, 'error');
// }

// @notice these are all the actions fired when the app starts up
store.dispatch(getCurrentUser());
//store.dispatch(getAuctions());

ReactDOM.render(
  // eslint-disable-next-line
  <Provider store={store}>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </Provider>,
  document.getElementById('root'),
);
