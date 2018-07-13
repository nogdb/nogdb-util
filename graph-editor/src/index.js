import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App.js';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './stores/store';
import { Provider } from 'react-redux'

ReactDOM.render(
    <Provider store={store}> 
      <App />
      </Provider>, 
    document.getElementById('root')
  );
  registerServiceWorker();