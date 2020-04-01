import React,{Component} from 'react';
import { Layout, Menu, Icon, Dropdown,message } from 'antd';
import {  HashRouter as Router, Route, Switch, Link,browserHistory  } from "react-router-dom";
const { Header, Content, Footer, Sider } = Layout;
import { connect } from "react-redux";
import axios from 'axios';
import history from '@/utils/history'
const { SubMenu } = Menu;
import CRouter from '../routes/index'
import SideMenu from './sideMenu'
import notFound from "@/pages/notFound";
import AllComponents from '../pages/index'

import routeConfig from '../routes/config'
import {logout} from "@/services/user";
import {getRes} from "@/utils";

@connect((store) => {
    return {
        user:store.userReducer.user,
        app:store.app,
    };
})

class dLayouta extends Component {
    constructor(props) {
        super(props);
        this.props.dispatch({type:'SET_USER',payload:JSON.parse(sessionStorage.getItem('user'))})
    }
    state = {
        collapsed: false,
    };

    componentDidMount(){
       // this.props.dispatch({type:'setData',payload:{ key:'lng' , value: sessionStorage.getItem('lng') || 'zh-CN' }})
    }
    render() {
        return (
            <div>
                <div>我是header</div>
                {this.props.children}
            </div>
        );
    }
}

export default dLayouta
