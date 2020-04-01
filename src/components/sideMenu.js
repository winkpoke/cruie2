import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { Link  } from "react-router-dom";
import { Menu, Icon } from 'antd';
const { SubMenu } = Menu;
import routesConfig from '../routes/config';

class SideMenu extends Component {
    generateMenus(menuList){
        return menuList.map(item=>{
            if(!item.subs){
                return <Menu.Item key={item.key}><Link to={item.key}>{item.icon ? <Icon type={item.icon} /> : ''}<span>{item.title}</span></Link></Menu.Item>
            }else{
                return <SubMenu key={item.key} title={<span>{ item.icon ? <Icon type={item.icon}/> : ''}<span>{item.title}</span></span>}>{this.generateMenus(item.subs)}</SubMenu>
            }
        })
    }
    render() {
        return (
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                {this.generateMenus(routesConfig['menus'])}
            </Menu>
        );
    }
}

SideMenu.propTypes = {};

export default SideMenu;
