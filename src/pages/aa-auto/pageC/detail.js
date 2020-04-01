import React,{Component} from 'react'
import { Row,Col, Form, Icon, Input,Select, Button, Checkbox,Divider } from 'antd';
import { connect } from 'react-redux';
import {formItemLayout,tailFormItemLayout,getRes} from '@/utils'
const {TextArea} = Input;
const {Option} = Select;
import * as api from '@/services/api'
import Mid from './partials/mid'
import {canclebubble} from '@/utils/utils'
@connect(({user,app}) => {
    return {user,app};
})
@Form.create()
class Detail extends Component {
    static displayName='Detail';
    state = {
        title:'',
        detail:{},
        curItem:{},

        id:this.props.match.params.id,
        isEdit:!!this.props.match.params.id,
        catDict:[],
        initOptions:{formData:{},formItem:[],formProps:{"label-width":60}}
    };

    constructor(props, context) {
        super(props, context);
        this.child = null;
        api.pageCDetail(this.state.id).then(res=>{
            if(res.code == 0  ){
                this.setState({pageCDetail:res.data});
                const {content:options} = res.data;
                //options['formData'] = {}
                res.data.content && this.props.dispatch({type:'setData',payload:{ key:'options' , value: options }});
                if(!res.data.content){
                    this.props.dispatch({type:'setData',payload:{ key:'options' , value: this.state.initOptions }});
                }
            }else{
                alert(res.message)
            }
        });
    }
    async componentWillMount(){
        this.setState({curItem:this.props.app.curItem})
    }
    goBack(){
        this.setState({options:this.state.initOptions,curItem:null})
        this.props.history.go(-1)
    }
    handlePreview(){
        window.open(this.state.pageCDetail.host+this.state.pageCDetail.routePath+'/'+this.state.id)
    }
    handleSave(e){
        e.preventDefault();
        this.props.form.validateFields( async (err, values) => {
            if (!err) {
                if(this.state.isEdit){
                    const {formItem} = _.cloneDeep(this.child.state.options);
                    const res = await api.pageCUpdate(this.state.id, {content:this.child.state.options});
                }
            }
        });
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
    changZd(zd,obj,ev){
        var ev = ev || window.event;
        var name = ev.target.name;
        canclebubble(ev);
        const {curItem} = this.props.app;

        obj[zd] = ev.target.value;
        this.props.dispatch({type:'setData',payload:{ key:'curItem' , value: curItem }})

        if(name.indexOf('.')>0){
            var pzd = name.split('.')[0];
            if(pzd == 'initRequest' && _.every(curItem[pzd])){
                const {method,url,params} = curItem[pzd];
                curItem['events']['onLoad'] =  `this.$http['${method}']('${url}').then(res=>{
                         this.$set(this.options.formData,'base',{custName:'lala' ,age:'12',gender:'female' })
                    })
                `
            }
        }
        this.props.dispatch({type:'setData',payload:{ key:'curItem' , value: curItem }});
        this.setState({curItem});
    }
    fnBlur(zd,obj,ev){
        var ev = ev || window.event;
        canclebubble(ev);
        var name = ev.target.name;
        if(zd=='key' && obj.type=='group'){
            const {options} = this.props.app;
            options.formData[obj[zd]] = {test:'111'};
            this.props.dispatch({type:'setData',payload:{ key:'options' , value: options }});
        }

        if(zd=='hasSubmitButton'){
            var value = ev.target.value;
            const {options} = this.props.app;
            if(value==1){
                options['submit'] = this.props.app.curItem
            }else{
                options['submit'] = null
            }
        }
    }
    onRef(ref){
        this.child = ref
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const {curItem} = this.props.app;
        var detail = curItem;
        var curItemKeys = curItem && Object.keys(curItem) || [];
        const getCom = (keys=[],obj=curItem , isObj = false, pzd)=>{
          return  keys.map((zd,idx)=>{
                if(zd=='children' || zd=='success' || zd=='fail') return;
                if( obj[zd].constructor === Object){
                        var newKeys = Object.keys(obj[zd]);
                        if(newKeys && newKeys.length>0){
                            return  <div key={idx}><Divider>{zd}</Divider>{getCom(newKeys,obj[zd] , true , zd)}</div>
                        }
                }else{
                  return isObj ?  <Form.Item key={idx} label={zd}>
                        {getFieldDecorator('detail.'+pzd+'.'+zd, {
                            //rules: [{ required: true, message: '请输入!' }],
                            initialValue: obj[zd].toString()
                        })(
                             <TextArea name={pzd+'.'+zd} rows={1} type="textarea"  onChange={this.changZd.bind(this,zd,obj)} placeholder={'请输入'+zd}/>
                        )}
                    </Form.Item> :
                      <Form.Item key={idx} label={zd}>
                          {getFieldDecorator('detail.'+zd, {
                              rules: [{ required: true, message: '请输入!' }],
                              initialValue: obj[zd]
                          })(
                              <Input disabled={zd=='type'} name={zd} onBlur={this.fnBlur.bind(this,zd,obj)}  onChange={this.changZd.bind(this,zd,obj)} placeholder={'请输入'+zd}/>
                          )}
                      </Form.Item>
                }
            })
        };
        return (
            <div>
                <Row className="bg-shadow padding-tb-10 padding-lr-20" type="flex" justify="space-between">
                    <h3 className="ti">{this.state.title} </h3>
                    <div>
                        <Button onClick={this.goBack.bind(this)}>返回</Button>
                        <Button onClick={this.handlePreview.bind(this)} type="primary" className="margin-l-10"> 预览 </Button>
                        <Button onClick={this.handleSave.bind(this)} type="primary" className="margin-l-10"> 保存 </Button>
                        <Button onClick={this.handleSubmit.bind(this)} type="primary" className="margin-l-10"> 发布 </Button>
                    </div>
                </Row>
                <Row className="bg-shadow margin-t-10 padding-24" id="base-container">
                        <Col className="padding-10 vh100" span={20}><Mid id={this.state.id} onRef={c=>this.child=c}/></Col>
                        <Col span={4}>
                            <div>{this.props.app['curItem'] && this.props.app.curItem.label} -- {this.props.app['curItem'] && this.props.app.curItem.key} </div>
                            <Form {...formItemLayout(8)}>
                                {getCom(curItemKeys)}
                            </Form>
                        </Col>
                </Row>
            </div>
        );
    }
}
export default Detail;