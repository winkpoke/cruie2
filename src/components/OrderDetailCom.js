/**
 * Created by miyaye on 2020/1/18.
 */
/**
 * Created by miyaye on 2020/1/18.
 */
import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as api from "../services/api";
import {getRes} from "../utils/utils";
import {Form,Table,Row,Col,Modal,Button,Input} from 'antd'
function mapStateToProps(state) {
  return {};
}

const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
};

@Form.create()
class OrderDetailCom extends Component {

  state={
    dataSource:[],
    modal2Visible: false,
  }

  componentDidMount(){
    api.getOrderDetail(this.props.match.params.id).then(res=>{
      getRes(res,data=>{
        this.setState({dataSource:data})
      })
    })
  }
  setModal2Visible(modal2Visible) {
    this.setState({ modal2Visible });
  }
  onOk(){
    this.props.form.validateFields((err,values) => {
      if (!err) {
        api.ship(this.props.match.params.id).then(res=>{
          getRes(res,data=>{
            location.reload();
          })
        })
        console.info('success',values);
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    var {dataSource:order} = this.state;
    const {order_process,items} = order;
    const columns = [
      {
        title: '产品名称',
        dataIndex: 'title',
        key: 'title',
        render(text,record){
           return record.product.title
        }
      },
      {
        title: 'sku',
        dataIndex: 'sku_info',
        key: 'sku_info',
      },
      {
        title: 'price',
        dataIndex: 'price',
        key: 'price',
      },
      {
        title: 'qty',
        dataIndex: 'qty',
        key: 'qty',
      },
      {
        title: 'subTotal',
        dataIndex: 'amount',
        key: 'amount',
      },
    ]
    return (
        <div  className="orderDetail-page">
          <div className="flex margin-b-10 just-space-between">
            <h2 className="margin-b-0">订单号:{order.orderNo}  订单状态：{order_process && _.takeRight(order_process)[0]['orderStatus']}</h2>
            {order.paid_at ?  <Button onClick={() => this.setModal2Visible(true)}>发货</Button> : ''}
          </div>

          <p>{order.created_at}</p>
          <Row className="orderDetail">
              <ul>
                <li>
                  <span>买家：{order.contact_name}</span>
                  <span>支付时间：{order.paid_at}</span>
                  <span>支付方式：{order.payment_method}</span>
                  <span>支付渠道编号：</span>
                  <span>收货地址：{order.address}</span>
                  <span>物流公司：{order.delivery}</span>
                  <span>物流编号：{order.tracking_number}</span>
                </li>
              </ul>
          </Row>
          <div className="bg-white">
            <Table  dataSource={items} rowKey="id" pagination={false} columns={columns} />
          </div>

          <Modal
              title="发货信息"
              centered
              visible={this.state.modal2Visible}
              onOk={ this.onOk.bind(this) }
              onCancel={() => this.setModal2Visible(false)}
          >
            <Form.Item {...formItemLayout} label="物流公司">
              {getFieldDecorator('delivery', {
                rules: [
                  {
                    required: true,
                    message: '请输入物流公司',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
            <Form.Item {...formItemLayout} label="物流单号">
              {getFieldDecorator('tracking_no', {
                rules: [
                  {
                    required: true,
                    message: '请输入物流单号',
                  },
                ],
              })(<Input placeholder="请输入" />)}
            </Form.Item>
          </Modal>
        </div>
    );
  }
}

export default connect(
    mapStateToProps,
)(OrderDetailCom);