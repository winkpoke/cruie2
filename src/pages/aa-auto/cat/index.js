import React, {Component} from 'react';
import * as api from '@/services/api'
import {Table, Row,Form,Button,Icon, Checkbox,Input,Modal,Select,Pagination,Popconfirm,Divider } from 'antd';
import {getRes,formItemLayout} from '@/utils'
import { Link } from "react-router-dom";
@Form.create()
class Cat extends Component {
    static displayName='Cat';
    state = {
        tableData:[],
        visible:false,
        modalTitle:'新增项目',
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
            console.log(values.detail)
            if (!err) {
               const res = await api.catAdd(values.detail);
               this.setState({visible:false})
               getRes(res,data=>this.queryList())
            }
        });
    }
    async queryList(){
         const res = await api.catList();
         getRes(res,data=>{
             this.setState({'tableData':data})
         })
    }
    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'index',
                render: (text, record)=> (record._id),
            },
            {
                title: '项目名称',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: '项目说明',
                dataIndex: 'content',
                key: 'content',
            },
            {
                title: '操作',
                key: 'tags',
                dataIndex: 'tags',
                render:  (text, record) => (
                    <div className="flex">
                    <Popconfirm
                        title="确定删除吗？"
                        okText="确认"
                        cancelText="取消"
                        onConfirm={async () => {
                          const res = await api.catDelete(record._id);
                          getRes(res,()=>this.queryList())
                        }}
                    >
                        <a href="#">Delete</a>
                    </Popconfirm>
                        <Divider type="vertical" />
                        <Link to="/pageConfigList">查看</Link><br/>
                    </div>
                ),
            }
        ];
        const { getFieldDecorator } = this.props.form;
        const {detail} = this.state;
        return (
            <div className="container padding-20">
                <Row type="flex" justify="end" className="margin-b-10"><Button onClick={this.showModal.bind(this)} type="primary">新增项目</Button></Row>
                <Table rowKey="_id" className="bg-shadow" dataSource={this.state.tableData} columns={columns}></Table>
                <Modal
                    title={this.state.modalTitle}
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                >
                      <Form {...formItemLayout(6)} onSubmit={this.handleOk.bind(this)} >
                        <Form.Item label="项目名称">
                          {getFieldDecorator('detail.title', {
                            rules: [{ required: true, message: '项目名称不能为空' }],
                          })(<Input placeholder="请输入"/>)}
                        </Form.Item>
                        <Form.Item label="项目说明">
                          {getFieldDecorator('detail.content', {
                            rules: [{ required: true, message: '项目说明为空' }],
                          })(<Input  placeholder="请输入"/>)}
                        </Form.Item>
                      </Form>
                </Modal>
            </div>
        );
    }
}
export default  (Cat);
