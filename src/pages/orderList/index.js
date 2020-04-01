import React, {Component} from 'react';
import {connect} from 'react-redux';

import OrderList from "../../components/OrderList";

function mapStateToProps(state) {
    return {};
}

class Order extends Component {

    render() {
        return (
            <div>
                <h2 className="padding-l-10">订单列表</h2>
                <div className="bg-shadow">
                    <OrderList {...this.props}/>
                </div>
            </div>
        );
    }
}

export default connect(
    mapStateToProps,
)(Order);