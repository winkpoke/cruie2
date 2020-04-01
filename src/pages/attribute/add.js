import React, {Component} from 'react';
import {connect} from 'react-redux';
import * as api from '@/services/attribute'
import {Table, Row,Form,Button,Icon, Checkbox,Input,Modal,Select ,Tabs } from 'antd';
import Basic from './partials/basic'
import Options from './partials/options'
import history from "@/utils/history";
import {getRes,formItemLayout,tailFormItemLayout} from '@/utils'

const TabPane = Tabs.TabPane;
@Form.create()
class NewAttribute extends Component {
    constructor(props){
        super(props);
    }
    state = {
        animated:false
    };
    callback(tab){}
    handleSubmit(e){
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                const {attribute,title,optionList} = values;
                const res = api.store({attribute,title,optionList});
                getRes(res,()=> history.go(-1))
            }
        });
    }
    render() {
        const { getFieldDecorator,getFieldValue  } = this.props.form;

        const operations =(<React.Fragment><Button size="small" onClick={()=>history.go(-1)}>返回</Button><Button htmlType="submit" size="small" type="primary" className="margin-l-10">保存</Button></React.Fragment>)
        return (
            <Form className="bg-shadow padding-24" {...formItemLayout(3)} onSubmit={this.handleSubmit.bind(this)}>
                <Tabs defaultActiveKey="1" onChange={this.callback.bind(this)} animated={this.state.animated} tabBarExtraContent={operations}>
                    <TabPane tab="基础信息" key="1">
                        <Basic getFieldDecorator={getFieldDecorator}/>
                    </TabPane>
                    <TabPane tab="选项配置" key="2">
                        <Options form={this.props.form} />
                    </TabPane>
                </Tabs>
            </Form>
        );
    }
}

NewAttribute.propTypes = {};

export default NewAttribute;
