import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Table, Row,Col,Form,Button,Icon, Checkbox,Input,Modal,Select ,Tabs } from 'antd';
import { dict } from '@/services/dict';
import {index as getAttrset} from '@/services/attributeset'
import {getRes} from '@/utils'
const {Option} = Select;

class Basic extends Component {
    state = {
        attrset:[]
    };
    async componentDidMount(){
        const attrsetList = await getAttrset();
        getRes(attrsetList,data=>{
            this.setState({attrset:data.data})
        })
    }
    handleSelectChange(){

    }
    render() {
        if(this.props.detail){
            var {attribute} = this.props.detail;
        }
        var attribute = attribute || {};

        const {getFieldDecorator} = this.props;
        return (
            <Row gutter={16}>
                <Col span={12}>
                    <Form.Item label="属性名称">
                              {getFieldDecorator('attribute.name', {
                                rules: [{ required: true, message: '请输入属性名称' }],
                                initialValue:attribute['name']
                              })(<Input placeholder="请输入"/>)}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="属性集">
                              {getFieldDecorator('attribute.attrset_id', {
                                rules: [{ required: true, message: '请选择!' }],
                                initialValue:attribute['attrset_id']
                              })(
                                <Select
                                  placeholder="请选择"
                                  onChange={this.handleSelectChange}
                                >
                                    {this.state.attrset.map((item,index)=>(<Option v="attrset_id" key={index} value={item.id}>{item.name}</Option>))}
                                </Select>,
                              )}
                            </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="类型">
                              {getFieldDecorator('attribute.type', {
                                rules: [{ required: true, message: '请选择类型' }],
                                initialValue:attribute['type']
                              })(
                                <Select
                                  placeholder="请选择"
                                  onChange={this.handleSelectChange}
                                >
                                    {dict.type.map((item, index) => (
                                        <Option v="type" key={index} value={item.value}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>,
                              )}
                            </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="是否是sku属性">
                              {getFieldDecorator('attribute.used_for_sku', {
                                rules: [{ required: true, message: '请选择是否是sku属性' }],
                                initialValue:attribute['used_for_sku']
                              })(
                                <Select
                                  placeholder="请选择"
                                  onChange={this.handleSelectChange}
                                >
                                    {dict.whether.map((item, index) => (
                                        <Option v="type" key={index} value={item.value}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>,
                              )}
                            </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="是否是销售属性">
                              {getFieldDecorator('attribute.used_for_sale', {
                                rules: [{ required: true, message: '请选择是否是销售属性' }],
                                initialValue:attribute['used_for_sale']
                              })(
                                <Select
                                  placeholder="请选择"
                                  onChange={this.handleSelectChange}
                                >
                                    {dict.whether.map((item, index) => (
                                        <Option v="type" key={index} value={item.value}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>,
                              )}
                            </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="是否用于筛选">
                              {getFieldDecorator('attribute.is_filterable', {
                                rules: [{ required: true, message: '请选择是否用于筛选' }],
                                initialValue:attribute['is_filterable']
                              })(
                                <Select
                                  placeholder="请选择"
                                  onChange={this.handleSelectChange}
                                >
                                    {dict.whether.map((item, index) => (
                                        <Option v="type" key={index} value={item.value}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>,
                              )}
                            </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="是否前台显示">
                              {getFieldDecorator('attribute.is_visible_on_front', {
                                rules: [{ required: true, message: '请选择是否前台显示' }],
                                initialValue:attribute['is_visible_on_front']
                              })(
                                <Select
                                  placeholder="请选择"
                                  onChange={this.handleSelectChange}
                                >
                                    {dict.whether.map((item, index) => (
                                        <Option v="type" key={index} value={item.value}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>,
                              )}
                            </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="排序">
                              {getFieldDecorator('attribute.position', {
                                rules: [{ required: true, message: '请输入排序' }],
                                initialValue:attribute['position']
                              })(<Input placeholder="请输入"/>)}
                    </Form.Item>
                </Col>
                <Col span={12}>
                    <Form.Item label="是否启用">
                              {getFieldDecorator('attribute.is_enabled', {
                                rules: [{ required: true, message: '请选择是否启用' }],
                                initialValue:attribute['is_enabled']
                              })(
                                <Select
                                  placeholder="请选择"
                                  onChange={this.handleSelectChange}
                                >
                                    {dict.whether.map((item, index) => (
                                        <Option v="type" key={index} value={item.value}>
                                            {item.name}
                                        </Option>
                                    ))}
                                </Select>
                              )}
                            </Form.Item>
                </Col>
            </Row>
        );
    }
}

Basic.propTypes = {};

export default Basic;
