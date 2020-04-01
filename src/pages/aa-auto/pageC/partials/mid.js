/**
 * Created by miyaye on 2020/3/17.
 */
import React, {Component} from 'react';
import { Row,Col, Form, Icon, Input,Select, Button, Checkbox,Divider ,Tabs  } from 'antd';
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import {addClass, canclebubble, getRes, guid, hasClass} from '../../../../utils/utils'
const { TabPane } = Tabs;
const {Option} = Select;
import * as api from '@/services/api'
@connect((store) => {
    return {
        user:store.userReducer.user,
        app:store.app,
    };
})
class MyComponent extends Component {
    static displayName="PageConfig";
    state={
        id:this.props.id,
        pageData:{
            pageTitle:"",//页面名称
            pagePath:"",//vue 路由
            pageRouteName:"",//路由名称
            pageParams:[],//路由params参数
            pageQuerys:[],//路由query参数
            breadCrumb:"" //页面面包屑
        },
        //options 是最终数据 包括初始化数据和配置
        options:{},
        coms:[
            {
                type:'input',
                label:'input',
                key:"",
                className:"",
                id:"",
                "data-pid":"",
                props:{
                    span:8
                },
                events:{
                    "on-change":'',
                    "on-blur":''
                },
                rules:{
                    required: true,
                    trigger: 'blur',
                    message: 'required'
                }
            },
            {
                type:'select',
                label:'select',
                key:"",
                className:"",
                id:"",
                "data-pid":"",
                props:{
                    span:8
                },
                events:{
                    "on-change":'',
                    "on-blur":''
                },
                rules:{
                    required: true,
                    trigger: 'blur',
                    message: 'required'
                }
            },
            {
                type:'tabbar',
                label:"tabbar",
                className:"tabbar",
                key:"defaultActiveKey",
                id:"",
                "data-pid":"",
                props:{
                    span:24
                },
                children:[
                    {
                        type:"tabpane",
                        label:"tab1",
                        className:"",
                        id:"",
                        props:{
                            span:24,
                        },
                        events:{
                            onLoad:'',
                            onSave:''
                        },
                        initRequest:{
                            method:"",
                            url:"",
                            params:''
                        },
                        saveRequest:{
                            method:"",
                            url:"",
                            params:""
                        },
                        children:[

                        ]
                    },
                    {
                        type:"tabpane",
                        label:"tab2",
                        className:"",
                        key:"",
                        id:"",
                        "data-pid":"",
                        props:{
                            span:24,
                        },
                        events:{
                            onLoad:''
                        },
                        initRequest:{
                            method:"",
                            url:"",
                            params:""
                        },
                        saveRequest:{
                            method:"",
                            url:"",
                            params:""
                        },
                        children:[

                        ]
                    },
                ]
            }
        ],
        lastEnterEle:""
    };

    constructor(props, context) {
        super(props, context);
        if(props.onRef){//如果父组件传来该方法 则调用方法将子组件this指针传过去
            props.onRef(this)
        }

    }
    componentDidMount(){
        api.pageCDetail(this.state.id).then(res=>{
            if(res.code == 0  ){
                this.setState({pageCDetail:res.data});
                const {content:options} = res.data;
                //options['formData'] = {}
                res.data.content && this.props.dispatch({type:'setData',payload:{ key:'options' , value: options }});
                //初始化

                if(!res.data.content){
                    this.props.dispatch({type:'setData',payload:{ key:'options' , value: this.state.initOptions }});
                }

                res.data.content && this.setState({options:this.props.app.options});
            }else{
                alert(res.message)
            }
        });


    }
    addGroup(){
        const {formItem} = this.state.options;
        var index = formItem.length;
        formItem.push({
            type:'group',
            index:index,children:[],
            id:guid() +''+Date.now(),
            className:"group"+formItem.length,
            key:"",
            events:{onLoad:''},
            initRequest:{
                method:"",
                url:"",
                params:""
            },
            saveRequest:{
                method:"",
                url:"",
                params:""
            },
        });
        const {options} = this.state;
        options['formItem'] = formItem;
        this.setState({options})
    }
    liDragStart(menuItem){
        var ev = window.event;
        canclebubble(ev);
        menuItem = _.cloneDeep(menuItem);
        menuItem['id'] = guid()+'-'+Date.now();
        this.setState({dragItem:menuItem})
        //ev.dataTransfer.setData('comData',JSON.stringify(item));
    }
    dragEnter(item){
        var ev = window.event;
        const {target} = ev;
        item['className'] = 'bg-red';
        const {options,index} = this.getGroup(ev);
        document.title = 'enter'
        this.setState({options,lastEnterEle:target});
    }
    dragOver(item){
        var ev = window.event;
        const {target} = ev;
        this.resetClass();
        item['className'] = 'bg-red';
        ev.preventDefault();
        document.title='over';
    }
    dragleave(item){
        var ev = window.event;
        const {target} = ev;
        //item['className'] = 'bg-f3';
        document.title='leave';
        const {options,index} = this.getGroup(ev);
        this.setState({options});
    }
    drop(item,ev){
        document.title='drop'
        var ev = ev ||  window.event;
        ev.preventDefault();
        canclebubble(ev)
        const {dragItem:evData} = this.state;
        var {options,index} = this.getGroup(ev);

        item['className'] = 'bg-f3';
        //插入配置到当前group中

        evData['data-pid'] = item.id;

        if(evData['type'] == 'submit'){
            //提交按钮
            options['submit'] = evData;
        }

        if(evData.type=='tabbar'){
            evData.children.map(item=>{
                item.id = guid();
                item['data-pid'] = evData.id;
                return item
            })
        }

        item['children'].push(evData);

        this.resetClass();

        this.setState({options,dragItem:null});
        this.props.dispatch({type:'setData',payload:{ key:'curItem' , value: evData }})
    }
    removeItem(index,parent,ev){
        console.log('remove')
        var ev = ev ||  window.event;
        ev.preventDefault();
        canclebubble(ev);

        var {options} = this.getGroup(ev);
        parent.children.splice(index,1);
        this.setState({options});
        this.props.dispatch({type:'setData',payload:{ key:'curItem' , value: null }})
        this.resetClass();

    }
    resetClass(defaultClassName=""){
        const {options:{formItem}} = this.state;
        function reset(formItem) {
            formItem.map(item=>{
                item.className = item.type=='group' ? 'group '+defaultClassName : defaultClassName;
                if(item.children){
                    reset(item.children);
                }
                return item;
            });
        }
        reset(formItem);
    }
    setSubmitBtn(){

    }
    getGroup(ev,cb){
        const {target} = ev;
        let index = target.getAttribute('data-index');
        const {options} = this.state;
        return {options,index}
    }
    fnClick(item ,ev){
        console.log('click');
        this.props.dispatch({type:'setData',payload:{ key:'curItem' , value: null }})
        var ev = ev || window.event;
        const {options} = this.state;
        ev.preventDefault();
        canclebubble(ev);
        this.resetClass('');

        item.className= item.type == 'group' ? 'bg-red group' : 'bg-red';

        this.setState({options},()=>{
            this.props.dispatch({type:'setData',payload:{ key:'curItem' , value: item }})
        })
    }
    fnSubmit(ev){
        var curItem = {
            hasSubmitButton:0,//是否有提交按钮
            text: '提交',
            props: {
                type: 'primary'
            },
            success(formData) {
                alert(JSON.stringify(formData))
            },
            fail(formData) {
                alert('验证失败')
            }
        }
        this.props.dispatch({type:'setData',payload:{ key:'curItem' , value: curItem }});
    }
    render() {
        const {options} = this.state;
        const {formItem} = this.state.options;

        const getCom = (item,index)=>{
            var com;
            switch (item.type){
                case 'group': case 'tabpane':
                    com = <Row
                               className={'group drag-zone '+item.className}
                               data-index={index}
                               onClick={this.fnClick.bind(this,item)}
                               onDragOver={this.dragOver.bind(this,item)}
                               onDragEnter={this.dragEnter.bind(this,item)}
                               onDragLeave={this.dragleave.bind(this,item)}
                               onDrop={this.drop.bind(this,item)}
                    >
                        {item.children.map((child,idx1)=>
                            <Col className={'col '+ child.className }
                                 onClick={this.fnClick.bind(this,child)}
                                 span={child.props['span'] || 24}
                                 key={idx1}>{getCom(child,idx1)}
                                 <span className="iconfont icon-delete" onClick={this.removeItem.bind(this,idx1,item)}></span>
                            </Col>
                        )}
                    </Row>
                    break;
                case 'input':
                    com = <Form.Item name={item.key} label={item.label}><Input /></Form.Item>;
                    break;
                case 'select':
                    com = <Form.Item name={item.key} label={item.label} >
                        <Select placeholder="Select a option and change input text above" allowClear  >
                            <Option value="male">male</Option>
                            <Option value="female">female</Option>
                            <Option value="other">other</Option>
                        </Select>
                    </Form.Item>
                    break;

                case 'tabbar':
                    com = <Tabs defaultActiveKey="1" onClick={this.fnClick.bind(this,item)} className={item.className}>
                        {item.children.map((tabpane,index)=> <TabPane tab={tabpane.label} key={index}>{getCom(tabpane,index)}</TabPane> )}
                    </Tabs>
                    break;
                case 'submit': case 'button':
                    com = <Button type="primary">{item.text}</Button>
                    break
            }

            return com
        }

        const layout = {
            labelCol: { span: 6 },
            wrapperCol: { span: 16 },
        };
        return (
                <Form {...layout} name="basic">
                    <div className="flex align-start">
                        <ul>
                            <li className="color-gray">拖拽区</li>
                            {this.state.coms.map((menuItem,index)=>
                                <li
                                    onDragStart={this.liDragStart.bind(this,menuItem)}
                                    draggable key={index}>
                                    {menuItem.label|| menuItem.text}
                                </li>)}
                                <Divider></Divider>
                                <li className="color-gray">点击区</li>
                                <li onClick={this.fnSubmit.bind(this)}>提交</li>
                        </ul>

                        <div id="div1">
                            <Button size="small" className="pull-right" onClick={this.addGroup.bind(this)}>新建分组</Button>
                            {formItem && formItem.map((item,index)=> <div key={index} className="group-container">{getCom(item,index)}</div> )}
                        </div>

                    </div>
                </Form>
        );
    }
}

MyComponent.propTypes = {};

export default MyComponent;
