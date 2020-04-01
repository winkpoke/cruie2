/**
 * Created by miyaye on 2020/1/18.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as api from "../services/api";
import {getRes} from "../utils/utils";
import {Row,Col} from 'antd'
import { Link} from "react-router-dom";
function mapStateToProps(state) {
  return {};
}

class OrderList extends Component {
  static async getInitialProps(props){
    const {query} = props;
    console.log('======query:',query)
    return query;
  }
  state={
    dataSource:[]
  }
  componentDidMount(){
    api.getOrderList().then(res=>{
      getRes(res,data=>{
        this.setState({dataSource:data})
      })
    })
  }
  render() {
    var {dataSource:{data}} = this.state;
    //data = _.groupBy(data,'orderNo')
    return (
        <div className="bg-white">
          <div className="table padding-20">
              <table className="table is-fullwidth">
                <thead>
                <tr>
                  <th width="360">商品信息</th>
                  <th width="147">单价</th>
                  <th width="147">数量</th>
                  <th width="147">订单总价</th>
                  <th width="147">状态</th>
                  <th width="105">操作</th>
                </tr>
                </thead>
              </table>

            <div>
              {data && data.map(order=> <div className="order-block" key={order.id}>
                <table className="table is-fullwidth">
                  <thead>
                  <tr>
                      <th width="360" className="font12">{order.created_at}  <span className="font-weight-normal">订单号：{order.orderNo}</span></th>
                      <th width="147"> </th>
                      <th width="147"> </th>
                      <th width="147">{order.total_amount}</th>
                      <th width="147">{order.status}</th>
                      <th><Link to={`/admin/orderDetail/${order.id}`}  ><a>查看详情</a></Link></th>
                  </tr>
                  </thead>
                <tbody>
                {
                  order.items.map(item=><tr key={item.id}>
                    <td>{item.product.title}</td>
                    <td>{item.product.price}</td>
                    <td>{item.qty}</td>
                    <th> </th>
                    <th> </th>
                    <td></td>
                  </tr>)
                }
                </tbody>
                </table>
                </div>
            )}
            </div>
          </div>
        </div>
    );
  }
}

export default connect(
    mapStateToProps,
)(OrderList);