import React, { Component } from 'react';
import { Row, Col, Form, Icon, Input, Select, Button, Checkbox, Tabs } from 'antd';
import { connect } from 'react-redux';
import { dict } from '@/services/dict';
import Sku from './partials/sku';
import {formItemLayout,tailFormItemLayout,getRes} from '@/utils'
import * as api from '@/services/product'
import {index as fetchAttrSets,getAttrsBySet} from '@/services/attributeset'
import {index as fetchCats} from '@/services/pdc-cat'
const queryString = require('query-string');

const { TextArea } = Input;
const { Option } = Select;
const { Fragment } = React;

@connect(store=>{
    return {app:store.app}
})
@Form.create()
class Detail extends Component {
    static displayName = "Detail";
    constructor(props) {
        super(props);
        this.state = {
            isEdit:false,
            title: '新增产品',
            currentAttrs:[],//属性列表
            saleAttrs: [],//销售属性
            skuAttrs: [],//sku属性
            attrsets: [],//属性集
            detail: null,
            selectedSkuRows: [],//选中的行
            cats: [],//分类
            route: props.route,
            match: props.match,
            barFixed:false,
            left:this.props.sideBarCollapsed ? '50px' : '200px'
        };
    }
    async componentDidMount() {
        //监听页面滚动事件
        window.addEventListener('scroll', this.handleScroll.bind(this) );

        if(this.props.match.params.id){
            this.setState({isEdit:true})
        }
        //获取属性集列表
        const attrsetsRes = await fetchAttrSets();
        getRes(attrsetsRes,data=>{
            this.setState({attrsets:data.data})
        });

        //获取分类列表
        const catRes = await fetchCats(this.props.app.lng);
        getRes(catRes,data=>{
            this.setState({cats:data.data})
        })

        //获取详情=========================================================================================
        const { match, route } = this.props;
        if (!match.params.id) return;

        this.setState({title:'编辑产品'});

        const detailRes = await api.show(match.params.id,this.props.app.lng);
        getRes(detailRes,data=>{
            data['cat_id'] = _.map(data['cats'],'id');
            this.setState({detail:data,  selectedSkuRows: data['skus']});
        });

        //根据属性集获取属性列表
        const parsed = queryString.parse(this.props.location.search);
        this.handleSelectSetChange(parsed.attrsetId)

    }
    componentWillReceiveProps(newProps) {
        this.setState({left:newProps.app.sideBarCollapsed ? '80px' : '200px'});
    }
    //修改属性集
    handleSelectSetChange = async id => {
        //根据属性集获取属性
        const attrRes = await getAttrsBySet(id);
        getRes(attrRes,data=>{
            //设置属性
            this.setState({currentAttrs:data})
            this.setAttrs(data);
        })
    };
    setAttrs(data) {
        var _this = this;
        const res = _.groupBy(data, item => {
            return item.used_for_sku;
        });

        //sku的属性 color,size
        const skuAttrs = res[1];
        const attrsWithValue = this.state.isEdit ? this.state.detail.attrs : this.state.currentAttrs;
        if(!!skuAttrs && skuAttrs.length > 0){
            skuAttrs.map((item, index) => {
                item['checkedList'] = []; //选中值
                item['indeterminate'] = true; //是否未全选
                item['checkAll'] = false; //是否全选
                //如果是编辑页
                if (this.state.isEdit) {
                    const { id } = item;
                    var vals = _.map(
                        _.filter(
                            attrsWithValue,
                            item =>
                                item.product_sku_id !== 0 &&
                                this.state.detail.id == item.product_id &&
                                item.attribute_id == id
                        ),
                        'value'
                    );
                    item['checkedList'] = Array.from(new Set(vals)).map(item => Number(item));
                    if (item.checkedList.length == item.options.length) {
                        item['checkAll'] = true;
                        item['indeterminate'] = !item['checkAll'];
                    }
                }

                item.options.map(option => {
                    option['label'] = option['value'];
                    option['value'] = option['id'];
                });
            });
        }

        var saleAttrs = res[0];
        if (!!saleAttrs && location.pathname.indexOf('new') == -1 && saleAttrs.length > 0) {
            saleAttrs.map(item => {
                const { id } = item;
                var val = _.map(
                    _.filter(
                        attrsWithValue,
                        item =>
                            item.product_sku_id == 0 &&
                            this.state.detail.id == item.product_id &&
                            item.attribute_id == id
                    ),
                    'value'
                );
                item['value'] = Number(val[0]);
            });
        }

        saleAttrs = _.groupBy(saleAttrs, (item, index) => {
            return Math.floor(index / 2);
        });

        this.setState({saleAttrs:_.values(saleAttrs),skuAttrs:res[1]})
    }

    handleSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields(async (err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                //产品入库
                const { attrs } = values.detail;
                var attrArr = [];
                if(attrs){
                    for (var key in attrs) {
                        attrArr.push({ attribute_id: key, value: attrs[key] });
                    }
                }
                values.detail['locale'] = this.props.app.lng;
                values.detail['attrs'] = attrArr;
                values.detail['skus'] = this.state.selectedSkuRows;
                values.detail['images'] = this.state.detail.images;
                if (values.detail['skus'].length > 0) {
                    var lowestPrice = _.map(this.state.selectedSkuRows, 'price').sort((n, m) =>
                        Number(n) < Number(m) ? -1 : 1
                    )[0];
                    values.detail['price'] = lowestPrice;
                }
                if (this.state.isEdit == false) {
                   const res = await api.store(values.detail);
                   //getRes(res,()=>this.props.history.go(-1));
                } else {
                   const res = await api.update(this.state.match.params.id,values.detail);
                    //getRes(res,()=>this.props.history.go(-1));
                }
            }
        });
    };
    goBack(){
        this.props.history.go(-1)
    }
    async changeFile() {
        var files = event.target.files;
        var formData = new FormData();
        for (var i = 0; i < files.length; i++) {
            formData.append('images[]', files[i]);
        }
        const res = await api.upload(formData);
        getRes(res,data=>{
            var {detail} = this.state;
            if(detail == null) detail = {images:[]};
            var item = _.find(detail['images'],{name:data[0]['name']});
            if(!item){
                detail['images'] = [...detail['images'],...data]
            }else{
                detail['images'] = data;
            }
            this.setState({detail})
        })
    }
    toggleMain(index) {
        var files = _.map(this.state.files, (file, idx) => {
            file['main'] = false;
            if (index == idx) file['main'] = true;
            return file;
        });
        this.setState({ files });
    }
    getSelectedRows(selectedSkuRows){
        this.setState({selectedSkuRows})
    }
    remove(index) {
        var files = this.state.detail.images;
        files.splice(index, 1);
        this.setState({ files });
    }
    handleScroll() {
        var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        var offsetTop = this.refs['actions'] && this.refs['actions'].offsetTop;

        this.setState({'barFixed':scrollTop > offsetTop});
    }
    render() {
        const { getFieldDecorator, getFieldValue } = this.props.form;
        const { match, route } = this.props;
        const { detail } = this.state || {};
        return (
            <div title={this.state.title}>
                <div ref="actions" className={this.state.barFixed ? 'fixed barActions' : 'barActions' } style={{left:this.state.left}}>
                    <Row className="bg-shadow padding-tb-10 padding-lr-20" type="flex" justify="space-between">
                        <h3 className="ti">{this.state.title}</h3>
                        <div>
                            <Button onClick={this.goBack.bind(this)}>返回</Button>
                            <Button onClick={this.handleSubmit.bind(this)} type="primary" className="margin-l-10"> 保存 </Button>
                        </div>
                    </Row>
                </div>
                <Row className="bg-shadow padding-tb-24 margin-t-10">
                    <Col span={20} offset={1}>
                        <Form
                            {...formItemLayout(4)}
                            onSubmit={this.handleSubmit}
                            className="attribute-form"
                        >
                            <div className="ti"><b>基本信息</b></div>
                            <Form.Item label="产品名称">
                                {getFieldDecorator('detail.title', {
                                    rules: [{ required: true, message: '必填项不能为空!' }],
                                    initialValue: detail ? detail['title'] : '' ,
                                })(<Input placeholder="title" />)}
                            </Form.Item>
                            <Form.Item label="关键字">
                                {getFieldDecorator('detail.keywords', {
                                    rules: [{ required: true, message: '必填项不能为空!' }],
                                    initialValue: detail ? detail['keywords'] : '',
                                })(<Input placeholder="必填项不能为空" />)}
                            </Form.Item>
                            <Form.Item label="seo描述">
                                {getFieldDecorator('detail.meta_description', {
                                    rules: [{ required: true, message: '必填项不能为空!' }],
                                    initialValue: detail ? detail['meta_description'] : '',
                                })(<TextArea placeholder="必填项不能为空" />)}
                            </Form.Item>
                            <Form.Item label="价格">
                                {getFieldDecorator('detail.price', {
                                    rules: [{ required: true, message: '必填项不能为空!' }],
                                    initialValue: detail ? detail['price'] : '',
                                })(<Input placeholder="必填项不能为空" />)}
                            </Form.Item>
                            <Form.Item label="属性集">
                                {getFieldDecorator('detail.attrset_id', {
                                    rules: [{ required: true, message: '请选择!' }],
                                    initialValue: detail ? detail['attrset_id'] : '',
                                })(
                                    <Select
                                        placeholder="请选择"
                                        getPopupContainer={triggerNode => triggerNode.parentNode}
                                        onChange={this.handleSelectSetChange}
                                    >
                                        {this.state.attrsets.map(item => (
                                            <Option key={item.id} value={item.id}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                            {this.state.saleAttrs.length > 0 ? (
                                <Fragment>
                                    <div className="ti">销售属性</div>
                                    <Row>
                                        <Col span={20} offset={4}>
                                            <div className="saleAttrsWrap">
                                                {this.state.saleAttrs.map((row, index) => (
                                                    <Row key={index}>
                                                        {row.map((item, indexItem) => (
                                                            <Col key={indexItem} span={10} gutter={10} offset={1}>
                                                                <Form.Item label={item.title}>
                                                                    {getFieldDecorator('detail.attrs.' + item.id, {
                                                                        rules: [{ required: true, message: '请选择!' }],
                                                                        initialValue: item['value'] || '',
                                                                    })(
                                                                        <Select placeholder="请选择" onChange={this.handleSelectChange}>
                                                                            {item.options.map((opt, indexOpt) => (
                                                                                <Option key={indexOpt} value={opt.id}>
                                                                                    {opt.value}
                                                                                </Option>
                                                                            ))}
                                                                        </Select>
                                                                    )}
                                                                </Form.Item>
                                                            </Col>
                                                        ))}
                                                    </Row>
                                                ))}
                                            </div>
                                        </Col>
                                    </Row>
                                </Fragment>
                            ) : (
                                ''
                            )}
                            {this.state.skuAttrs.length > 0  && this.state.currentAttrs.length ? <Sku
                                                                   currentAttrs={this.state.currentAttrs}
                                                                   detail={this.state.detail}
                                                                   skuAttrs={this.state.skuAttrs}
                                                                   saleAttrs={this.state.saleAttrs}
                                                                   isEdit={this.state.isEdit}
                                                                   getSelectedRows={this.getSelectedRows.bind(this)}
                                                                   api={api}
                                                                   route={route} /> : ''}
                            <div className="ti"><b>图文描述</b></div>
                            <Form.Item label="宝贝图片">
                                {getFieldDecorator('detail.images', {
                                    rules: [
                                        /*{
                                                                required: true,
                                                                message: '必填项不能为空',
                                                            },*/
                                    ],
                                    initialValue: detail ? detail.images : '',
                                })(
                                        <div>
                                            <Row className="image-upload-zone">
                                                <Col span={4}>
                                                    <input className="fileSelector" onChange={this.changeFile.bind(this)} type="file" multiple />
                                                    <i className="iconfont icon-tianjia"></i>
                                                </Col>
                                                { this.state.detail &&
                                                this.state.detail['images'].length > 0 &&
                                                this.state.detail['images'].map((item, index) => (
                                                    <Col key={index} span={4}>
                                                        <div className="tools">
                                                            <div className="inner">
                                                                <i onClick={() => {this.toggleMain(index);}} className={item.main ? 'iconfont  icon-checkboxpartial' : 'iconfont icon-iconfontcheckboxunchecked'}></i>
                                                                <i onClick={() => {this.remove(index);}} className="iconfont icon-delete"></i>
                                                            </div>
                                                        </div>
                                                        <img src={item['path']} className="uploaded-img" alt="" />
                                                    </Col>
                                                ))}
                                            </Row>
                                        </div>
                                )}
                            </Form.Item>
                            <Form.Item label="描述">
                                {getFieldDecorator('detail.description', {
                                    rules: [{ required: true, message: '必填项不能为空!' }],
                                    initialValue: detail ?  detail['description'] : '',
                                })(<TextArea rows={10} placeholder="必填项不能为空" />)}
                            </Form.Item>

                            <Form.Item label="产品分类">
                                {getFieldDecorator('detail.cat_id', {
                                    rules: [{ required: true, message: '请选择!' }],
                                    initialValue: detail ? detail['cat_id'] : []})(
                                    <Select placeholder="请选择" onChange={this.handleSelectChange} mode="multiple">
                                        {this.state.cats && this.state.cats.map((cat, index) => (
                                            <Option key={index} value={cat.id}>
                                                {cat.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>

                            <Form.Item label="是否上线">
                                {getFieldDecorator('detail.on_sale', {
                                    rules: [{ required: true, message: '请选择!' }],
                                    initialValue: detail ? detail['on_sale'] : '',
                                })(
                                    <Select placeholder="请选择" onChange={this.handleSelectChange}>
                                        {dict.whether.map((item, index) => (
                                            <Option v="used_for_sku" key={index} value={item.value}>
                                                {item.name}
                                            </Option>
                                        ))}
                                    </Select>
                                )}
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </div>
        );
    }
}
Detail.propTypes = {};
export default Detail;
