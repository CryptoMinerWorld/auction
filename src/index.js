import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux'
import App from './App';
import store from './store'
import {getAuctions} from "./pages/market/marketActions"

store.dispatch(getAuctions())

// eslint-disable-next-line
ReactDOM.render(<Provider store={store}> 
<App />
</Provider >, document.getElementById('root'));
