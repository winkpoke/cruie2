import React, {Component} from 'react';
import {Alert, Form, Input, Button,  Row, Col, message, Modal, Icon, Tabs,Checkbox} from 'antd';
import { Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import io from 'socket.io-client';

import history from '@/utils/history'
//检查是否登陆
import {authCheck} from "@/pages/login/actions";
import {accountLogin} from "@/services/user";
import {getRes} from "@/utils";
import { useForm } from 'react-hook-form';

class Index extends Component {
    static displayName='Login';
    constructor(props) {
        super(props);

    }
    state = { redirectToReferrer: authCheck.isAuthenticated };
    /*handleSubmit =   e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                accountLogin({username:values.email,password:values.password}).then(res=>{
                    getRes(res,data=>{
                        sessionStorage.setItem('user',JSON.stringify(res));
                        this.setState({ redirectToReferrer: true });
                        history.push('/admin/dash')
                    })
                })
            }
        });
    };*/
    componentDidMount() {
        const socket = io('http://localhost:3000');
        socket.emit('chat message', '你好..');

        socket.emit('say to someone', '你好 say..');

        socket.on('chat message', function(msg){
             console.log('我收到管理员的回复了:'+msg);
        });
        socket.on('hi', function(msg){
            console.log('我收到管理员的回复了hi:'+msg);
        });

        socket.on('connect', function(){
            console.log('connect');
            //客户端关闭
            setTimeout(() => socket.close(), 5000);
        });
        socket.on('event', function(data){});
        socket.on('disconnect', function(){
            console.log('dis connect')
        });
    }

    render() {

        return (
            <div className="wrapper" style={{height: "auto",minHeight: "100%"}}>
                <header className="main-header">
                    <span className="logo">CURIE</span>
                    <nav className="navbar" role="navigation"></nav>
                </header>
                <div className="w3layouts">
                    <div className="signin-agile">
                        <form id="loginForm"  >
                            <ul>
                                <li style={{fontWeight: 'bold'}}>
                                    Sign In CURIE
                                </li>
                                <li>
                                    <input type="text" name="username" style={{width: "91%"}} className="name" placeholder="UserName" />
                                </li>
                                <li>
                                    <input type="password" name="password" style={{width:"91%"}} className="password" placeholder="password" />
                                </li>
                                <li>
                                    <input type="checkbox" name="remember" id="brand1" value=""/> Remember me
                                </li>
                                <li>
                                    <input type="submit" value="Sign In" style={{width: '91%'}}/>
                                </li>
                                <li style={{color: '#AFB2AB'}}>
                                    Have problem? <span style={{borderBottom: "1px solid"}}>Contact Us.</span>
                                </li>
                            </ul>
                        </form>
                    </div>
                    <div className="mid-line"></div>
                    <div className="signup-agileinfo" style={{paddingTop: "150px"}}>
                        <h3>CURIE System</h3>
                        <p>Guide Better. Treat Better.</p>
                    </div>
                    <div className="clear"></div>
                </div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}
const IndexForm = Form.create({ name: 'normal_login' })(Index);

export default connect(
    mapStateToProps,
)(IndexForm);
