import React from 'react';
import ReactDOM from 'react-dom'
import App from './App'

import 'antd/dist/antd.css'

import './assets/main.less';
import { Provider } from "react-redux"
import store from "./store/index"
import  './utils/axiosSetting'

store.subscribe(() => {
    //console.log("store changed", store.getState());
});

// 屏幕适配
/*(function(doc, win) {
    var docEl = doc.documentElement
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize';
    var recalc = function() {
        var clientWidth = docEl.clientWidth
        if (!clientWidth) return
        docEl.style.fontSize = 10 * (clientWidth / 375) + 'px'
    };
    if (!doc.addEventListener) return
    win.addEventListener(resizeEvt, recalc, false)
    doc.addEventListener('DOMContentLoaded', recalc, false)
})(document, window);*/

ReactDOM.render( <Provider store={store}> <App/></Provider>, document.getElementById('root'));
