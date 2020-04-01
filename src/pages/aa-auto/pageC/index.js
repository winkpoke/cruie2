import React, {Component} from 'react';
import * as api from '@/services/api'
import {Table, Row,Form,Button,Icon, Checkbox,Input,Modal,Select,Pagination,Divider ,Popconfirm } from 'antd';
import {Link} from 'react-router-dom'
import {getRes,formItemLayout} from '@/utils'
import {connect} from 'react-redux'

@connect(({user,app}) => {
    return {user,app};
})
@Form.create()
class ProductCategory extends Component {
    static displayName='ProductCategory';
    state = {
        tableData:[],
        visible:false,
        modalTitle:'新增分类',
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
                const res = await api.pageCAdd(values.detail);
                this.setState({visible:false})
                getRes(res,data=>this.queryList())
            }
        });
    }
    goTo(){
         this.props.history.push('/pageC/add');
    }
    async queryList(){
        const {app} = this.props;
        const res = await api.pageCIndex(app.lng);
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
                title: '页面名称',
                dataIndex: 'title',
                key: 'title',
            },
            {
                title: '访问路由',
                dataIndex: 'routeName',
                key: 'routeName',
            },
            {
                title: '路由参数',
                dataIndex: 'routeParams',
                key: 'routeParams',
            },
            {
                title: '所属项目',
                dataIndex: 'cid',
                key: 'cid',
            },
            {
                title: '说明',
                dataIndex: 'desc',
                key: 'desc',
            },
            {
                title: '配置内容',
                dataIndex: 'content',
                key: 'content',
            },
            {
                title: '操作',
                key: 'tags',
                dataIndex: 'tags',
                render:  (text, record) => (
                    <div>
                        <Popconfirm
                            title="确定删除吗？"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={async () => {
                                const res = await api.pageCDelete(record._id);
                                getRes(res,()=> this.queryList())
                            }}
                        >
                            <a href="#">删除</a>
                            <Divider type="vertical" />
                            <Link to={`/pageC/${record._id}`}>编辑</Link>
                            <Divider type="vertical" />
                            <Link to={`/pageC/${record._id}`}>查看</Link>
                        </Popconfirm>
                    </div>
                ),
            }
        ];
        const { getFieldDecorator } = this.props.form;
        const {detail} = this.state;
        return (
            <div className="padding-20">
                <Row type="flex" justify="end" className="margin-b-10"><Button onClick={this.showModal.bind(this)} type="primary">新增页面</Button></Row>
                <Table rowKey="_id" className="bg-shadow" dataSource={this.state.tableData} columns={columns}></Table>

                <Modal
                    title={this.state.modalTitle}
                    visible={this.state.visible}
                    onOk={this.handleOk.bind(this)}
                    onCancel={this.hideModal.bind(this)}
                >
                    <Form {...formItemLayout(6)} onSubmit={this.handleOk.bind(this)} >
                        <Form.Item label="页面名称">
                            {getFieldDecorator('detail.title', {
                                rules: [{ required: true, message: '名称不能为空' }],
                            })(<Input placeholder="请输入"/>)}
                        </Form.Item>
                        <Form.Item label="页面说明">
                            {getFieldDecorator('detail.desc', {
                                rules: [{ required: true, message: '不能为空' }],
                                initialValue:"我是默认说明"
                            })(<Input  placeholder="请输入"/>)}
                        </Form.Item>
                        <Form.Item label="路由host">
                            {getFieldDecorator('detail.host', {
                                rules: [{ required: true, message: '不能为空' }],
                                initialValue:"http://localhost:8090/#"
                            })(<Input  placeholder="请输入"/>)}
                        </Form.Item>
                        <Form.Item label="访问路由">
                            {getFieldDecorator('detail.routePath', {
                                rules: [{ required: true, message: '不能为空' }],
                                initialValue:"/test"
                            })(<Input  placeholder="请输入"/>)}
                        </Form.Item>
                        <Form.Item label="路由名称">
                            {getFieldDecorator('detail.routeName', {
                                rules: [{ required: true, message: '不能为空' }],
                                initialValue:"test"
                            })(<Input  placeholder="请输入"/>)}
                        </Form.Item>
                        <Form.Item label="路由参数">
                            {getFieldDecorator('detail.routeParams', {
                                rules: [{ required: true, message: '不能为空' }],
                                initialValue:"{}"
                            })(<Input  placeholder="请输入"/>)}
                        </Form.Item>
                    </Form>
                </Modal>

            </div>
        );
    }
}
export default  ProductCategory;
