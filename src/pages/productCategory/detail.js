import React,{Component} from 'react'
import { Row,Col, Form, Icon, Input,Select, Button, Checkbox } from 'antd';
import { connect } from 'react-redux';
import {formItemLayout,tailFormItemLayout} from '@/utils'
const {TextArea} = Input;
const {Option} = Select;
import * as api from '@/services/pdc-cat'
import {getRes} from "@/utils";

@connect(({user,app}) => {
    return {user,app};
})
@Form.create()
class Detail extends Component {
    static displayName='Detail';
    state = {
        title:'',
        detail:{},
        isEdit:!!this.props.match.params.id,
        catDict:[]
    };
    async componentDidMount(){
        //获取所有的分类
        const catDictRes = await api.index();
        getRes(catDictRes,data=>this.setState({catDict:data.data}));

        if(this.state.isEdit){
           const res = await api.show(this.props.match.params.id,this.props.app.lng);
           getRes(res,data=>this.setState({detail:data ,id:this.props.match.params.id ,title:'编辑分类' }))
        }else{
            this.setState({title:'新增分类'})
        }
    }
    goBack(){
        this.props.history.go(-1)
    }
    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields( async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                values.detail['locale'] = this.props.app.lng;
                if(this.state.isEdit){
                    const res = await api.update(this.state.id,values.detail);
                    getRes(res,()=>this.goBack());

                }else{
                    const res = await api.store(values.detail);
                    getRes(res,()=>this.goBack());
                }
            }
        });
    };

    render() {
        const { getFieldDecorator } = this.props.form;
        var zero = 0;
        return (
            <div>
                <Row className="bg-shadow padding-tb-10 padding-lr-20" type="flex" justify="space-between">
                    <h3 className="ti">{this.state.title}</h3>
                    <div>
                        <Button onClick={this.goBack.bind(this)}>返回</Button>
                        <Button onClick={this.handleSubmit.bind(this)} type="primary" className="margin-l-10"  > 提交 </Button>
                    </div>
                </Row>
                <Row className="bg-shadow margin-t-10 padding-tb-24">
                    <Col lg={{ span: 18, offset: 2 }} >
                        <Form {...formItemLayout(3)}  >
                            <Form.Item label="分类名称">
                                {getFieldDecorator('detail.name', {
                                    rules: [{ required: true, message: '请输入!' }],
                                    initialValue: this.state.detail['name'] || ''
                                })(<Input placeholder="请输入分类名称"/>)}
                            </Form.Item>
                            <Form.Item label="页面标题">
                                {getFieldDecorator('detail.title', {
                                    rules: [{ required: true, message: '请输入!' }],
                                    initialValue:this.state.detail['title']
                                })(<Input placeholder="请输入页面标题"/>)}
                            </Form.Item>
                            <Form.Item label="关键字">
                                {getFieldDecorator('detail.keywords', {
                                    rules: [{ required: true, message: '请输入!' }],
                                    initialValue:this.state.detail['keywords']
                                })(<Input placeholder="请输入关键字"/>)}
                            </Form.Item>
                            <Form.Item label="seo描述">
                                {getFieldDecorator('detail.meta_description', {
                                    rules: [{ required: true, message: '请输入!' }],
                                    initialValue:this.state.detail['meta_description']
                                })(<Input placeholder="请输入seo描述"/>)}
                            </Form.Item>
                            <Form.Item label="父级">
                                {getFieldDecorator('detail.pid', {
                                    initialValue:this.state['pid']
                                })(
                                    <Select
                                        placeholder="请选择"
                                        onChange={this.handleSelectChange}
                                    >
                                        {this.state.catDict.map(item=> item.id != this.state.id ? <Option key={item.id} value={item.id}>{item.name}</Option> : '')}
                                    </Select>,
                                )}
                            </Form.Item>
                            <Form.Item label="描述">
                                {getFieldDecorator('detail.description', {
                                    rules: [{ required: true, message: '请输入!' }],
                                    initialValue:this.state.detail['description']
                                })(<TextArea placeholder="请输入描述"/>)}
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default Detail;