import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as api from '@/services/attribute'
import {Table, Row,Form,Button,Icon, Checkbox,Input,Modal,Select ,Tabs } from 'antd';
import Basic from './partials/basic'
import Options from './partials/options'
import history from "@/utils/history";
import {getRes,formItemLayout} from '@/utils'

const TabPane = Tabs.TabPane;
@Form.create()
class EditAttribute extends Component {
    constructor(props){
        super(props);
        this.queryDetail = this.queryDetail.bind(this);
    }
    state = {
        animated:false,
        id:this.props.match.params.id,
        inited:false,
        detail:{}
    };
    callback(tab){}
    componentDidMount(){
        this.queryDetail();
    }
    async queryDetail(locale){
        const res =await api.show( this.state.id , locale );
        getRes(res,data=>{
            const attribute = _.omit(data,'optionList','translations');
            const {options:optionList} = data;
            var title = {title:data['title'],locale:attribute['locale']};
            this.setState({detail:{attribute,title,optionList},inited:true});
        })
    }
    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const {attribute,title,optionList} = values;
                const res = await api.update(this.state.id, {attribute,title,optionList});
                //getRes(res,()=> history.go(-1))
            }
        });
    }
    render() {
        const { getFieldDecorator,getFieldValue  } = this.props.form;
        const operations =(<React.Fragment><Button size="small" onClick={()=>history.go(-1)}>返回</Button><Button htmlType="submit" size="small" type="primary" className="margin-l-10">保存</Button></React.Fragment>)
        return (
            <Form {...formItemLayout(6)} onSubmit={this.handleSubmit.bind(this)}>
                {this.state.inited ?
                <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)} animated={this.state.animated} tabBarExtraContent={operations}>
                    <TabPane tab="基础信息" key="1">
                        <Basic detail={this.state.detail} getFieldDecorator={getFieldDecorator}/>
                    </TabPane>
                    <TabPane tab="选项配置" key="2">
                        <Options id={this.state.id} queryDetail={this.queryDetail} detail={this.state.detail} form={this.props.form} />
                    </TabPane>
                </Tabs>
                    : ''
                }
            </Form>
        );
    }
}

export default EditAttribute;
