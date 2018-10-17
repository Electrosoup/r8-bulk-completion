/* istanbul ignore file */

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components';
import configureStore from "./store/configure-store";
import { Provider } from "react-redux";
const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <App source={'http://127.0.0.1:6543/qualification/bulk_complete.json'}/>
  </Provider>,
  document.getElementById("root")
);
