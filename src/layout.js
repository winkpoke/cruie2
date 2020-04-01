import React, {Component} from 'react';
import {connect} from 'react-redux';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;

class Page extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Header style={{background:"#fff" }} className="header">
                    <h1 className="logo" >Asty</h1>
                </Header>
                这是layout哟
                {this.props.children}
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {};
}

export default connect(
    mapStateToProps,
)(Page);
