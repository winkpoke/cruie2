import React, {Component} from 'react';
import {Alert, Form, Input, Button, Checkbox, Row, Col, message, Modal, Icon, Tabs} from 'antd';
import {connect} from 'react-redux';
import dashLayout from '@/components/dLayout'
import DLayouta  from '@/components/dLayout1'
@connect((store) => {
    return {};
})
class Index extends Component {
    static displayName='Dash';
    componentDidMount(){
        //this.props.dispatch({type:'user/alice'})
    }
    render() {
        return (
            <DLayouta test='123'>
                adminssss
            </DLayouta>
        );
    }
}

function mapStateToProps(state) {
    console.log(state)
    return { };
}

/*export default connect(
    mapStateToProps,
)(dashLayout(Index));*/

export default  (Index)
