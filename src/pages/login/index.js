import React, {Component} from 'react';
import {Alert, Form, Input, Button,  Row, Col, message, Modal, Icon, Tabs,Checkbox} from 'antd';
import { Redirect } from "react-router-dom";
import {connect} from 'react-redux';
import axios from 'axios';

//检查是否登陆
import {authCheck} from "@/pages/login/actions";

class Index extends Component {
    static displayName='Login';
    constructor(props) {
        super(props);
    }
    state = { redirectToReferrer: authCheck.isAuthenticated };
    handleSubmit =   e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                axios.post('/api/login',{email:values.email,password:values.password}).then(res=>{
                    if(res.status == 'ok'){
                        //this.props.history.push('/admin');
                        sessionStorage.setItem('user',JSON.stringify(res))
                        this.setState({ redirectToReferrer: true });
                    }
                })
            }
        });
    };

    render() {
        let { from } = this.props.location.state || { from: { pathname: "/admin" } };
        let { redirectToReferrer } = this.state;
        if (redirectToReferrer) return <Redirect to={from} />;

        const { getFieldDecorator } = this.props.form;
        return (
            <Row>
                <Col span={6} offset={9}>
                    <Form onSubmit={this.handleSubmit} className="login-form bg-shadow">
                        <Form.Item>
                            {getFieldDecorator('email', {rules: [{ required: true, message: '请输入用户名' }],})
                            (<Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名"/>,)}
                        </Form.Item>
                        <Form.Item>
                            {getFieldDecorator('password', {rules: [{ required: true, message: '请输入密码' }],})
                            (<Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码"/>,)}
                        </Form.Item>
                        <Form.Item>{getFieldDecorator('remember', {valuePropName: 'checked', initialValue: true,})(<Checkbox>记住我</Checkbox>)}
                            <a className="login-form-forgot" href="">忘记密码</a>
                            <Button type="primary" htmlType="submit" block className="login-form-button">登陆</Button>
                            或 <a href="">立即注册!</a>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
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
