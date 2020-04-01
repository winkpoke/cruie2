import React, {Component} from 'react';
import {Table, Row,Col,Form,Button,Icon, Checkbox,Input,Modal,Select ,Tabs } from 'antd';
import {tailFormItemLayout,formItemLayout, getRes} from '@/utils'
import getLocales from '@/utils/getLocales'

const langs = getLocales();

class Options extends Component {
    static displayName = 'Options';
    constructor(props, context) {
        super(props, context);
        this.state = {
            num:0,
            id:'',
            title:{},
            optionList:[]
        }
    }
    componentWillReceiveProps(nextProps) { // 父组件重传props时就会调用这个方法
        if(nextProps.id){
            var {title,optionList} = nextProps.detail;
            this.setState({
                num:optionList.length,
                id:this.props.id,
                isEdit: true ,
                title,
                optionList
            })
        }
    }
    componentDidMount(){
        if(this.props.detail){
            var {title,optionList} = this.props.detail;
            this.setState({
                num:optionList.length,
                id:this.props.id,
                isEdit:true ,
                title,
                optionList
            })
        }
    }
    remove = k => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys');
        if (keys.length === 1) {
            return;
        }
        form.setFieldsValue({
            keys: keys.filter(key => key !== k),
        });
    };

    add = () => {
        const { form } = this.props;
        const keys = form.getFieldValue('keys',{initialValue:this.getInitialVals()});
        const nextKeys = keys.concat(this.state.num++);
        form.setFieldsValue({
            keys: nextKeys,
        });
    };
    handleSelectChange(val){
        if(this.props.detail){
            this.props.queryDetail(val);
        }
    }
    getInitialVals(){
        return this.state.isEdit ? Array.from({length:this.state.optionList.length},(k,v)=>v) : []
    }
    render() {

        var title = this.state.title;
        var optionList = this.state.optionList;

        const Option = Select.Option;
        const { getFieldDecorator, getFieldValue } = this.props.form;
        getFieldDecorator('keys', { initialValue: this.getInitialVals() });

        const keys = getFieldValue('keys');

        const formItems = keys.map((k, index) => (
            <Row key={k} gutter={10}>
                <Col span={10}>
                    <Form.Item {...tailFormItemLayout(0)} required={false}>
                        {getFieldDecorator(`optionList[${k}]['name']`, {validateTrigger: ['onChange', 'onBlur'], rules: [{required: true, whitespace: true, message: "请输入属性选项的name"}],
                            initialValue: !!optionList[`${k}`] ?  optionList[`${k}`]['name'] : ''  })
                        (<Input placeholder="请输入属性 option的name,例如：red" style={{   marginRight: 8 }} />)}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item {...tailFormItemLayout(0)} required={false}>
                        {getFieldDecorator(`optionList[${k}]['value']`, {validateTrigger: ['onChange', 'onBlur'], rules: [{required: true, whitespace: true, message: "请输入属性选项对应的值"}],
                            initialValue: !!optionList[`${k}`] ? optionList[`${k}`]['value']  : ''
                        })(<Input placeholder="请输入属性选项对应的值,例如：红色" style={{ width:"85%",  marginRight: 8 }} />)}
                        {keys.length > 1 ? (<Icon className="dynamic-delete-button" type="minus-circle-o" onClick={() => this.remove(k)}/>) : null}
                    </Form.Item>
                </Col>
            </Row>
        ));

        return (
            <React.Fragment>
            <Row>
                    <Form.Item {...formItemLayout(3)} label="当前语言">
                              {getFieldDecorator('title.locale', {
                                rules: [{ required: true, message: '请选择!' }],
                                initialValue:title['locale']
                              })(
                                <Select
                                  placeholder="请选择"
                                  onChange={this.handleSelectChange.bind(this)}
                                >
                                    {langs.map((item, index) => (
                                        <Option v="type" key={index} value={item.code}>
                                            {item.label}
                                        </Option>
                                    ))}
                                </Select>,
                              )}
                            </Form.Item>

                    <Form.Item  {...formItemLayout(3)} label="属性名称">
                        {getFieldDecorator('title.title', {
                            rules: [{ required: true, message: '请输入!' }],
                            initialValue:title['title']
                        })(<Input placeholder="请输入"/>)}
                    </Form.Item>

            </Row>
            <Row>
                <Form.Item className="Item" {...formItemLayout(3)} label="选项列表">
                    {formItems}
                    <Form.Item {...tailFormItemLayout(0)}>
                        <Button type="dashed" onClick={this.add} style={{ width: '60%' }}>
                            <Icon type="plus" /> Add field
                        </Button>
                    </Form.Item>
                </Form.Item>
            </Row>
            </React.Fragment>
        );
    }
}

Options.propTypes = {};

export default Options;
