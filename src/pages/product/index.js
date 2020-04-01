import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Table, Row, Button, Divider, Modal, Transfer } from 'antd';
import {Link} from 'react-router-dom';
import * as api from '@/services/product'
import {getRes} from "@/utils";
@connect(store=>{
    return {app:store.app}
})
class Index extends Component {
    static displayName = 'dash-product-list'
    constructor(props) {
        super(props);
    }
    state = {
      tableData:[],
      pagination:{
        current:1,
        pageSize:20,
        size:"small",
        showQuickJumper:true,
        showSizeChanger:true,
        pageSizeOptions:["20","40"],
        showTotal:this.showTotal.bind(this),
        onChange:this.onChange.bind(this),
        onShowSizeChange:this.onShowSizeChange.bind(this)
      }
    }
    showTotal(total){ return `共 ${total} 条`}
    onChange(page, pageSize){
      console.log(page)
      this.queryList(page)
    }
    onShowSizeChange(current, size){
      const {pagination} = this.state;
      pagination['pageSizeOptions'] = size;
      pagination['current'] = 1;
    }
     componentDidMount() {
        //获取列表
        this.queryList();
    }
    async queryList(page=1){
        var _this = this;
        const res = await api.index(this.props.app.lng,page);
        getRes(res,(data)=>{
            data.data.map(item=>item.key = item.id);
            const {pagination} = this.state;
            pagination['total'] = data.total;
            pagination['current'] = page;
            this.setState({'tableData':data.data,pagination})
        })
    }
    goToNewAttrPage = () => {
        this.props.history.push('/admin/product/add');
    };
    remove = async id => {
         const res = await api.remove(id);
         getRes(res,()=>this.queryList)
    };
    render() {
        const columns = [
          {
            title: '序号',
            dataIndex: 'id',
            key: 'id',
            render: (text, record,index) => <span>{ (index+1) + (this.state.pagination.current-1)*20 }</span>,
          },
            {
                title: '产品id',
                dataIndex: 'id',
                key: 'id',
                render: text => <a>{text}</a>,
            },
            {
                title: '产品名称',
                dataIndex: 'title',
                key: 'title',
                render: text => <a>{text}</a>,
            },
            {
                title: '是否上线',
                dataIndex: 'on_sale',
                key: 'on_sale',
                render: (text, record) => <span>{record.on_sale ? '是' : '否'}</span>,
            },
            {
                title: '价格',
                dataIndex: 'price',
                key: 'price',
            },
            {
                title: '属性集',
                dataIndex: 'attrset_id',
                key: 'attrset_id',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
            <Link to={`/admin/product/detail/${record.id}?attrsetId=${record.attrset_id}`}>编辑</Link>
            <Divider type="vertical" />
            <a onClick={() => {this.remove(record.id);}}  > 删除 </a>
          </span>
                ),
            },
        ];

        this.state.tableData.map(item => {
            item['key'] = item['id'];
        });

        return (
            <div title="产品列表">
                <Row type="flex" justify="end" className="text-right opt-buttons margin-b-10">
                    <Button onClick={this.goToNewAttrPage} type="primary"> 新增产品 </Button>
                </Row>
                <Table size="small" className="bg-shadow" columns={columns} dataSource={this.state.tableData} pagination={this.state.pagination} />
            </div>
        );
    }
}

Index.propTypes = {};

export default Index;
