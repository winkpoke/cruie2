import React,{Component} from 'react';
import {  HashRouter as Router, Route, Switch, Link,browserHistory  } from "react-router-dom";
import { connect } from "react-redux";
/*import axios from 'axios';
import history from '@/utils/history'
import CRouter from '../routes/index'
import notFound from "@/pages/notFound";
import AllComponents from '../pages/index'

import routeConfig from '../routes/config'*/
import {logout} from "@/services/user";
import {getRes} from "@/utils";
import {Spin} from 'antd';
import 'antd/es/spin/style/css';
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
        loading:false
    };

    componentDidMount(){
       // this.props.dispatch({type:'setData',payload:{ key:'lng' , value: sessionStorage.getItem('lng') || 'zh-CN' }})
    }
    componentWillReceiveProps(nextProps){
        this.setState({loading:nextProps.app.loading})
    }
    render() {
        return (

            <div className={this.props.className}>
                <div id="head-nav" className="navbar navbar-default navbar-fixed-top" style={{"width":"100%"}}>
                    <div className="container-fluid">
                        <div className="navbar-header">
                            <a className="navbar-brand" href="#"><span>CURIE</span></a>
                        </div>
                        <div className="navbar-collapse collapse">
                            <ul className="nav navbar-nav">
                                <li className="active"><a href="#"><span style={{"borderBottom":"3px solid"}}>CBCT</span></a></li>
                            </ul>
                            <ul className="nav navbar-nav navbar-right user-nav">
                                <li className="dropdown profile_menu">
                                    <a href="#" className="dropdown-toggle" data-toggle="dropdown" style={{"paddingTop":"3px solid"}} aria-expanded="false">Javis Heinscof <b className="caret"></b></a>
                                    <ul className="dropdown-menu">
                                        <li><a href="system_tolerance.html">System Settings</a></li>
                                        <li><a href="account.html">Account Settings</a></li>
                                        <li><a href="#">Sign Out</a></li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <hr style={{"marginTop": "0px" , "marginBottom":"0px" , "border":1 }}/>
                <div className="fixed-menu" id="cl-wrapper">
                    {this.props.children}
                </div>
            </div>

        );
    }
}

export default dLayouta
