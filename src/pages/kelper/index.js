import React, {Component} from 'react';
import * as wasm from "hello-wasm-pack";
import { start, GlCanvas, ViewType } from "kepler";

import Second from './second'
import 'antd/es/spin/style/css';
import {connect} from 'react-redux';
import EventBus from '@/utils/eventBus';

@connect((store) => {
    return {app:store.app};
})
class kp extends Component {
    static displayName = "Kelper";
    state={
        cWidth:945,
        cHeight:630,
        inited:false
    };
    constructor(props, context) {
        super(props, context);
        this.glcanvas = null;
        this.second = new Second();
        this.fnGetPos = this.second.fnGetPos.bind(this);
        if(props.onRef){//如果父组件传来该方法 则调用方法将子组件this指针传过去
            props.onRef(this)
        }
    }
    setGl(name,value ){
        const {kpData,tsc} = this.props.app;
        const obj = {};
        let shift = this.glcanvas.get_shift();
        switch (name){
            case 'slider_blend':
                this.glcanvas.set_blend(value);
                break;
            case 'slider_window':
                this.glcanvas.set_window(value);
                break;
            case 'slider_level':
                this.glcanvas.set_level(value);
                break;
            case 'pan'://类型
                break;
            case 'slider_scale':
                this.glcanvas[`set_scale_${tsc}`](value);
                break;
            case 'slider_pan_x':
                this.glcanvas[`set_pan_${tsc}_x`](value);
                break;
            case 'slider_pan_y':
                this.glcanvas[`set_pan_${tsc}_y`](value);
                break;
            case 'slider_slice':
                this.glcanvas[`set_slice_${tsc}`](value);
                break;
            case 'slider_shift_x':
                this.glcanvas.set_shift(value, shift[1], shift[2]);
                break
            case 'slider_shift_y':
                this.glcanvas.set_shift(shift[0], value, shift[2]);
                break
            case 'slider_shift_z':
                this.glcanvas.set_shift(shift[0], shift[1], value);
                break
        }
        obj[name] = value;
        kpData[name] = value;

        this.glcanvas.render();
        this.props.dispatch({type:'setData',payload:{key:'kpData',value:kpData}});
        this.setState(obj);
    }
    fnChange(e){
        console.log('触发了change事件',new Date())
        const {name,value} = e.target;
        const obj = {};
        obj[name] = value;
        this.setGl(name,value);
        console.log('====fnchange obj===',obj);
    }
    componentWillReceiveProps(nextProps){

    }
    getWH(){
        const {showSideBar,showPatientInfo} = this.props.app;
        var dWidth = document.documentElement.clientWidth;
        if(showSideBar==false && showPatientInfo==false){//左侧都隐藏
            var w = dWidth - 260 ;
            console.log(0)
        }else if(showSideBar && !showPatientInfo){//左侧显示一个
            console.log(1)
            var w = dWidth - 480;
        }else if(!showSideBar && showPatientInfo){//左侧显示一个
            var w = dWidth - 420;
            console.log(2)
        }else if(showSideBar && showPatientInfo){//左侧都显示
            var w = dWidth - 400 - 212
            console.log(3)
        }

        w =  parseInt(w/3) * 3 ;
        var h = parseInt(w/3)*2;
        this.setState({cWidth:w, cHeight:h})
        if(this.glcanvas){
            this.glcanvas.set_canvas_dim(w, h);
            this.glcanvas.render();
        }

        return {w,h}
    }
    componentWillMount(){
        const {kpData} = this.props.app;
        this.setState({kpData});
        this.second.fnMounseDown.call(this,'sss');
        this.getWH()
    }
    componentDidMount(){
        document.addEventListener('DOMMouseScroll', (e)=>{console.log('DOMMouseScroll');e.preventDefault();return false}, false);
        document.addEventListener('mousewheel',(e)=>{this.second.fnScroll.call(this)},{ passive: false });

        this.glcanvas = GlCanvas.new("mycanvas", this.state.cWidth, this.state.cHeight, this.state.kpData.slider_window, this.state.kpData.slider_level);
        // this.glcanvas.load_shaders();
        this.glcanvas.set_window(12000);
        this.glcanvas.set_level(15000);
        this.glcanvas.setup_geometry();
        this.glcanvas.render();

        console.log(ViewType.SAGITTAL || 'ssss' );
        console.log('window:',this.glcanvas.window);

        this.setState({inited:true})

        EventBus.addListener('updateGl', (res)=>{
            console.log('====updateGl====',res);
            this.glRender(res);
        });
        EventBus.addListener('setGl', (res)=>{
            console.log('====setGl====',res);
            this.setGl(res);
        });
    }
    glRender(obj){
        const {buffers,curNode:{detail:{patinfo}}} = this.props.app;
        const {columns,rows,window,level,numSlices,spacing} = patinfo
        var primaryKey = obj['primary'];
        if(primaryKey){
            this.glcanvas.load_primary(buffers[primaryKey], columns,rows,numSlices, spacing[0], spacing[1], spacing[2]);
        }

        var secondaryKey = obj['secondary'];
        if(obj['secondary']){
            this.glcanvas.load_secondary(buffers[secondaryKey], columns,rows,numSlices, spacing[0], spacing[1], spacing[2]);
        }
        this.glcanvas.set_window(window);
        this.glcanvas.set_level(level);

        this.glcanvas.setup_geometry();
        this.glcanvas.set_blend(0.5);
        this.glcanvas.render();
        this.props.dispatch({type:'setData',payload:{key:'loading',value:false}});
    }
    render() {
        const {cWidth,cHeight,slider_blend,slider_window,slider_level,pan,slider_scale,slider_pan_x,slider_pan_y,slider_slice} = this.state;
        return (
                <div className="kelper page">
                    <canvas ref="canvas" id="mycanvas" className={this.props.app.action} width={cWidth} height={cHeight}
                            onMouseDown={this.second.fnMounseDown.bind(this)}
                            onScroll={this.second.fnScroll.bind(this)}
                    >
                    </canvas>
                </div>
        );
    }
}


export default kp;
