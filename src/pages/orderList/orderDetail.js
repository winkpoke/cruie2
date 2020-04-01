/**
 * Created by miyaye on 2020/1/18.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import OrderDetailCom from "../../components/OrderDetailCom";

class OrderDetail extends Component {
  static async getInitialProps(props){
    const {query} = props;
    return query;
  }
  state = {}
  componentDidMount() {

  }

  render() {
    return (
          <OrderDetailCom {...this.props}/>
    );
  }
}

export default OrderDetail