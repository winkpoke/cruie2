import React, {Component} from 'react';
import * as api from '@/services/pdc-cat'
import {Table, Row,Form,Button,Icon, Checkbox,Input,Modal,Select,Pagination,Divider ,Popconfirm } from 'antd';
import {Link} from 'react-router-dom'
import {getRes} from '@/utils/index'
import {connect} from 'react-redux'

@connect(({user,app}) => {
    return {user,app};
})
@Form.create()
class ProductCategory extends Component {
    static displayName='ProductCategory';
    state = {
        tableData:[],
        modalTitle:'新增分类',
        pager:{
            total:0
        }
    };
    componentDidMount(){
        this.queryList();
    }
    goTo(){
         this.props.history.push('/admin/productCat/add');
    }
    async queryList(){
        const {app} = this.props;
        const res = await api.index(app.lng);
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
                title: '分类名称',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: '父级分类',
                dataIndex: 'pid',
                key: 'pid',
            },
            {
                title: '操作',
                key: 'tags',
                dataIndex: 'tags',
                render:  (text, record) => (
                    <div><Link to={`/admin/productCat/detail/${record.id}?lng=${this.props.app.lng}`}>编辑</Link><Divider type="vertical"/>
                        <Popconfirm
                            title="确定删除吗？"
                            okText="确定"
                            cancelText="取消"
                            onConfirm={async () => {
                                const res = await api.remove(record.id);
                                getRes(res,()=> this.queryList())
                            }}
                        >
                            <a href="#">删除</a>
                        </Popconfirm>
                    </div>
                ),
            }
        ];
        return (
            <div>
                <Row type="flex" justify="end" className="margin-b-10"><Button onClick={this.goTo.bind(this)} type="primary">新增分类</Button></Row>
                <Table className="bg-shadow" dataSource={this.state.tableData} columns={columns}></Table>
            </div>
        );
    }
}
export default  ProductCategory;
