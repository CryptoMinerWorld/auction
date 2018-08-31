import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AuctionProvider from './Provider';

ReactDOM.render(
  <AuctionProvider>
    <App />
  </AuctionProvider>,
  document.getElementById('root')
);
