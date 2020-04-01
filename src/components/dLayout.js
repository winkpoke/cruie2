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

const onClick = ({ key }) => {
    axios.post(`/api/logout`).then(res=>{
        sessionStorage.clear();
        history.push('/login')
    })
};

const menu = (
    <Menu onClick={onClick}>
        <Menu.Item key="1">退出</Menu.Item>
    </Menu>
);

@connect((store) => {
    return {
        user:store.userReducer.user,
        app:store.app,
    };
})

class dLayout extends Component {
    constructor(props) {
        super(props);
        this.props.dispatch({type:'SET_USER',payload:JSON.parse(sessionStorage.getItem('user'))})
    }
    state = {
        collapsed: false,
        //lng:  sessionStorage.getItem('lng') || 'zh-CN'
    };
    toggle = () => {
        this.props.dispatch({type:'setData',payload:{ key:'sideBarCollapsed' , value: !this.state.collapsed }})
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    changeLng = ({key})=>{
        sessionStorage.setItem('lng',key);
        this.props.dispatch({type:'setData',payload:{ key:'lng' , value: key }})
        this.setState({
            lng:key
        });
        location.reload();
    }
    componentDidMount(){
        this.props.dispatch({type:'setData',payload:{ key:'lng' , value: sessionStorage.getItem('lng') || 'zh-CN' }})
    }
    render() {
        const menuLng = (
            <Menu onClick={this.changeLng}>
                <Menu.Item key="en">en</Menu.Item>
                <Menu.Item key="zh-CN">zh-CN</Menu.Item>
                <Menu.Item key="de">de</Menu.Item>
            </Menu>
        )
        return (
            <div>
                <Layout>
                    <Sider ref="sider" style={{overflow: 'auto', overflowX:'hidden', height: '100vh',position:'fixed' ,zIndex:999 }}
                           collapsible collapsed={this.state.collapsed} onCollapse={this.toggle}>
                        <div className="logo color-white" > ASTSTORE </div>
                        <SideMenu></SideMenu>
                    </Sider>
                    <Layout style={{marginLeft: this.state.collapsed ? 80: 200 }}>
                        <Header style={{ background: '#f9fafb',  padding: "0 15px" ,boxShadow:"0 1px 4px rgba(0,0,0,.15)" }} >
                            <Dropdown overlay={menuLng} className="margin-r-10">
                                <a className="ant-dropdown-link">
                                     当前语言：{this.props.app.lng} <Icon type="down" />
                                </a>
                            </Dropdown>

                            <Dropdown overlay={menu}>
                                <a className="ant-dropdown-link">
                                    {this.props.user.currentAuthority} <Icon type="down" />
                                </a>
                            </Dropdown>
                        </Header>
                        <Content style={{ margin: '24px 16px 20px', overflow: 'initial' }}>
                            <CRouter/>
                        </Content>
                        <Footer style={{ textAlign: 'center'  }}>AstStore</Footer>
                    </Layout>
                </Layout>
            </div>
        );
    }
}

export default dLayout
