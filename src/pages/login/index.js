import React, {Component} from 'react';
import {Alert, Form, Input, Button,  Row, Col, message, Modal, Icon, Tabs,Checkbox} from 'antd';
import { Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import io from 'socket.io-client';

import history from '@/utils/history'
//检查是否登陆
import {authCheck} from "@/utils/authCheck";
import {accountLogin} from "@/services/user";
import {getRes} from "@/utils";
import { useForm } from 'react-hook-form';
import schema from 'async-validator';

import '@/assets/css/style.css'

var descriptor = {
    username: {
        type: "string",
        required: true,

    },
    password: {
        type: "string",
        required: true,

    }
};
var validator = new schema(descriptor);

class Index extends Component {
    static displayName='Login';
    constructor(props) {
        super(props);
    }

    state = {
        isAuthenticated: authCheck.isAuthenticated,
        username:"",
        password:"",
        remember:false,
        error:{}
    };
    changeInput(e){
        const {error , remember} = this.state;
        var obj = {};
        const {name,value} = e.target;
        obj[name] = value;

        if(name=='remember'){
            obj[name] = !remember
        }

       this.setState(obj);

       if(error[name]){
           this.setState({error: _.omit(error,name) })
       }
    }
    handleSubmit =   e => {
        e.preventDefault();
            console.log('Received values of form: ', e);
            const {username,password ,remember} = this.state;
            validator.validate({username,password,remember},(errors, fields) => {
                if(errors) {
                    const {error} = this.state;
                    errors.map(item=>{
                        const {field,message} = item;
                        error[field] = message;
                    });
                    this.setState({error})
                }else{
                    accountLogin({username, password, remember }).then(res=>{
                        getRes(res,data=>{
                            sessionStorage.setItem('user',JSON.stringify(res));
                            location.reload();
                        })
                    })
                }
            });
        return false
    };
    componentDidMount() {
        if(this.state.isAuthenticated){
            history.push('/admin')
        }

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

        const {error} = this.state;
        return (
            <div className="wrapper" style={{height: "auto",minHeight: "100%"}}>
                <header className="main-header">
                    <span className="logo">CURIE</span>
                    <nav className="navbar" role="navigation"></nav>
                </header>
                <div className="w3layouts">
                    <div className="signin-agile">
                        <form id="loginForm" method="post">
                            <ul>
                                <li style={{fontWeight: 'bold'}}>
                                    Sign In CURIE
                                </li>
                                <li>
                                    <input type="text" name="username" value={this.state.username} onChange={this.changeInput.bind(this)} style={{width: "91%"}} className="name" placeholder="UserName" />
                                    <p className="error">{error['username']}</p>
                                </li>
                                <li>
                                    <input type="password" name="password" value={this.state.password} style={{width:"91%"}} onChange={this.changeInput.bind(this)}  className="password" placeholder="password" />
                                    <p className="error">{error['password']}</p>
                                </li>
                                <li>
                                    <input type="checkbox" name="remember" value={this.state.remember}  onChange={this.changeInput.bind(this)}  id="brand1"/> Remember me
                                </li>
                                <li>
                                    <input className="submit-btn" type="submit" onClick={ this.handleSubmit.bind(this)} value="Sign In" style={{width: '91%'}}/>
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
