import React from 'react';
import ReactDOM from 'react-dom'
import App from './App'

import './assets/css/bootstrap.min.css'
import './assets/css/font-awesome.min.css'
import './assets/css/style.css'

import 'antd/dist/antd.css'
//import './assets/main.less';
import { Provider } from "react-redux"
import store from "./store/index"
import  './utils/axiosSetting'

window.reqPrefix = '/curie-api';

store.subscribe(() => {
    //console.log("store changed", store.getState());
});

ReactDOM.render( <Provider store={store}> <App/></Provider>, document.getElementById('root'));