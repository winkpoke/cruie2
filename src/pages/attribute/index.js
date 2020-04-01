import React, {Component} from 'react';
import * as api from '@/services/attribute'
import {Table, Row,Form,Button,Icon, Checkbox,Input,Modal,Select ,Tabs,Popconfirm,Divider } from 'antd';
import {getRes} from '@/utils/index'
import { Link } from "react-router-dom";


// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
    name: record.name,
  }),
};

class Attribute extends Component {
    constructor(props){
        super(props)
    }
    state={
        tableData:[]
    };
    add(){
        this.props.history.push('/admin/attribute/add');
    }
    componentDidMount(){
        this.queryList()
    }
    async queryList(){
        const res = await api.index();
        getRes(res,data=>{
            var tableData = data.data.map(row=>row.key=row.id)
            this.setState({tableData:data.data})
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
                title: '属性code',
                dataIndex: 'name',
                render: text => <a>{text}</a>,
            },
            {
                title: '类型',
                dataIndex: 'type',
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                <Link to={`/admin/attribute/detail/${record.id}`}>编辑</Link>
                <Divider type="vertical" />
          <Popconfirm
              title="Are you sure？"
              okText="Yes"
              cancelText="No"
              onConfirm={async () => {
                 const res = await api.remove(record.id);
                 getRes(res,()=>this.queryList());
              }}
          >
            <a href="#">Delete</a>
          </Popconfirm>
        </span>
                ),
            },
        ];
        return (
            <div>
                <Row type="flex" justify="end" className="margin-b-10"><Button onClick={this.add.bind(this)} type="primary">新增属性</Button></Row>
                <Table className="bg-shadow" rowSelection={rowSelection} dataSource={this.state.tableData} columns={columns}></Table>
            </div>
        );
    }
}

Attribute.propTypes = {};

export default  (Attribute);
