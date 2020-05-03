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
            var w = dWidth - 260;
        }else if(showSideBar && !showPatientInfo){//左侧显示一个
            var w = dWidth - 480;
        }else if(!showSideBar && showPatientInfo){//左侧显示一个
            var w = dWidth - 480;
        }else if(showSideBar && showPatientInfo){//左侧都显示
            var w = dWidth - 400
        }
        w = parseInt(w/3) * 3;
        var h = parseInt(w/3)*2;
        this.setState({cWidth:w, cHeight:h})
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
        const {buffers} = this.props.app;
        var primaryKey = obj['primary'];
        if(primaryKey){
            this.glcanvas.load_primary(buffers[primaryKey], 512, 512, 133, 1.98, 1.98, 5.0);
        }

        var secondaryKey = obj['secondary'];
        if(obj['secondary']){
            this.glcanvas.load_secondary(buffers[secondaryKey], 512, 512, 100, 1.98, 1.98, 5.0);
        }
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
                    {/*<div className="slide flex">*/}
                    {/*    <input type="range" min="0" max="1.0" step="0.01" name="slider_blend" value={slider_blend} onChange={this.fnChange.bind(this)} className="slider" id="slider_blend"/>*/}
                    {/*    <span>Blend</span>*/}
                    {/*</div>*/}
                    {/*/!*slider_window*!/*/}
                    {/*<div className="slide flex">*/}
                    {/*    <input type="range" min="1" max="3000" name="slider_window" value={slider_window} onChange={this.fnChange.bind(this)} className="slider" id="slider_window"/>*/}
                    {/*    <span>Window {slider_window}</span>*/}
                    {/*</div>*/}
                    {/*/!*slider_level*!/*/}
                    {/*<div className="slide flex">*/}
                    {/*    <input type="range" min="0" max="3000" name="slider_level" value={slider_level}  onChange={this.fnChange.bind(this)} className="slider" id="slider_level"/>*/}
                    {/*    <span>Level {slider_level}</span>*/}
                    {/*</div>*/}
                    {/*<form>*/}
                    {/*    /!*pan*!/*/}

                    {/*        <input type="radio" id="radio_transverse" name="pan" value="transverse" checked={pan=='transverse'} onChange={this.fnChange.bind(this)} />*/}
                    {/*        <label htmlFor="transverse">Transverse</label>*/}

                    {/*        <input type="radio" id="radio_sagittal" name="pan" value="sagittal" checked={pan=='sagittal'} onChange={this.fnChange.bind(this)}/>*/}
                    {/*        <label htmlFor="transverse">Sagittal</label>*/}


                    {/*        <input type="radio" id="radio_coronal" name="pan" value="coronal" checked={pan=='coronal'} onChange={this.fnChange.bind(this)}/>*/}
                    {/*        <label htmlFor="transverse">Coronal</label>*/}

                    {/*</form>*/}
                    {/*/!*scale*!/*/}
                    {/*<div className="slide flex">*/}
                    {/*    <input type="range" min="1" max="10" name="slider_scale" value={slider_scale} onChange={this.fnChange.bind(this)} step="0.1" className="slider" id="slider_scale"/>*/}
                    {/*    <span>Zoom in/out</span>*/}
                    {/*</div>*/}
                    {/*/!*slider_pan_x*!/*/}
                    {/*<div className="slide flex">*/}
                    {/*    <input type="range" min="-1" max="1" name="slider_pan_x" value={slider_pan_x} onChange={this.fnChange.bind(this)} step="0.01" className="slider" id="slider_pan_x"/>*/}
                    {/*    <span>Pan: X</span>*/}
                    {/*</div>*/}
                    {/*/!*slider_pan_y*!/*/}
                    {/*<div className="slide flex">*/}
                    {/*    <input type="range" min="-1" max="1" name="slider_pan_y" value={slider_pan_y} onChange={this.fnChange.bind(this)} step="0.01" className="slider" id="slider_pan_y"/>*/}
                    {/*    <span>Pan: Y</span>*/}
                    {/*</div>*/}
                    {/*/!*slice*!/*/}
                    {/*<div className="slide flex">*/}
                    {/*    <input type="range" min="0" max="1" name="slider_slice" value={slider_slice} onChange={this.fnChange.bind(this)} step="0.01" className="slider" id="slider_slice"/>*/}
                    {/*    <span>Slice {slider_slice}</span>*/}
                    {/*</div>*/}
                </div>
        );
    }
}


export default kp;
