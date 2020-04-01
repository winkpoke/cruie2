import React, {Component} from 'react';
import * as api from '@/services/attributeset'
import {Table, Row,Form,Button,Icon, Checkbox,Input,Modal,Select,Pagination,Popconfirm } from 'antd';
import {getRes,formItemLayout} from '@/utils'

@Form.create()
class AttributeSet extends Component {
    static displayName='AttributeSet';
    state = {
        tableData:[],
        visible:false,
        modalTitle:'新增属性集',
        detail:{},
        pager:{
            total:0
        }
    };
    componentDidMount(){
        this.queryList();
    }
    showModal(){
        this.setState({visible:true});
    }
    hideModal(){
        this.props.form.resetFields();
        this.setState({visible:false})
    }
    handleOk(){
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
               const res = await api.store(values.detail);
               getRes(res,data=>this.queryList())
            }
        });
    }
    async queryList(){
         const res = await api.index();
         getRes(res,data=>{
             var list = data.data.map(item=>{
                 item.key = item.id;
             });
             this.setState({'tableData':data.data})
         })
    }
    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                render: (text, record)=> (record.key),
            },
            {
                title: '属性集名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '父级',
                dataIndex: 'pid',
                key: 'pid',
            },
            {
                title: '操作',
                key: 'tags',
                dataIndex: 'tags',
                render:  (text, record) => (
                    <Popconfirm
                        title="确定删除吗？"
                        okText="确认"
                        cancelText="取消"
                        onConfirm={async () => {
                          const res = await api.remove(record.id);
                          getRes(res,()=>this.queryList())
                        }}
                    >
                        <a href="#">Delete</a>
                    </Popconfirm>
                ),
            }
        ];
        const { getFieldDecorator } = this.props.form;
        const {detail} = this.state;
        return (
            <div>
                <Row type="flex" justify="end" className="margin-b-10"><Button onClick={this.showModal.bind(this)} type="primary">新增属性集</Button></Row>
                <Table className="bg-shadow" dataSource={this.state.tableData} columns={columns}></Table>
                <Modal
                    title={this.state.modalTitle}
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                >
                      <Form {...formItemLayout(6)} onSubmit={this.handleOk.bind(this)} >
                        <Form.Item label="属性集名称">
                          {getFieldDecorator('detail.name', {
                            rules: [{ required: true, message: '属性集名称不能为空' }],
                          })(<Input placeholder="请输入"/>)}
                        </Form.Item>
                        <Form.Item label="父属性集">
                          {getFieldDecorator('detail.pid', {
                            rules: [{ required: true, message: '父属性集不能为空' }],
                          })(<Input type="password" placeholder="请输入"/>)}
                        </Form.Item>
                          <Form.Item label="序号">
                              {getFieldDecorator('detail.sort_order', {
                                  rules: [{ required: true, message: '序号不能为空' }],
                              })(<Input placeholder="请输入"/>)}
                          </Form.Item>
                      </Form>
                </Modal>
            </div>
        );
    }
}
export default  (AttributeSet);
