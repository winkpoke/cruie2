import React, {Component} from 'react';
import * as wasm from "hello-wasm-pack";
import { start, GlCanvas, ViewType } from "kepler";
import { Spin} from 'antd';
import {get, post} from '@/utils/request'
import io from 'socket.io-client';
import Second from './second'
import 'antd/es/spin/style/css';
var socket;
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
    }
    setGl(name,value,panXY=[]){
        const {kpData} = this.props.app;
        const obj = {};
        if(panXY.length == 0){
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
                    this.glcanvas[`set_scale_${this.state.pan}`](value);
                    break;
                case 'slider_pan_x':
                    this.glcanvas[`set_pan_${this.state.pan}_x`](value);
                    break;
                case 'slider_pan_y':
                    this.glcanvas[`set_pan_${this.state.pan}_y`](value);
                    break;
                case 'slider_slice':
                    this.glcanvas[`set_slice_${this.state.pan}`](value);
                    break;
            }
            obj[name] = value;
            kpData[name] = value;
        }else{
            kpData['slider_pan_x'] = panXY[0];
            kpData['slider_pan_y'] = panXY[1];
            this.glcanvas[`set_pan_${this.state.pan}_x`](panXY[0]);
            this.glcanvas[`set_pan_${this.state.pan}_y`](panXY[1]);
        }
        this.props.dispatch({type:'setData',payload:{key:'kpData',value:kpData}});
        this.glcanvas.render();
        this.setState(obj);
    }
    fnChange(e){
        console.log('触发了change事件')
        const {name,value} = e.target;
        const obj = {};
        obj[name] = value;
        //var glcanvas = this.getGlCanvas();
        //console.log('name:',name,'| value:',value);
        this.setGl(name,value);
        console.log('====fnchange obj===',obj);
        //this.setState(obj);
    }
    concatArrayBuffer(arr){
        var arr1 = [];
        arr.map((arrayBuffer,index)=>{
            arr1.push(Buffer.from(arrayBuffer));
            return arrayBuffer
        });
        return Buffer.concat(arr1)
    }
    base64ToUint8Array(base64String) {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding)
            .replace(/\-/g, '+')
            .replace(/_/g, '/');

        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);

        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        return outputArray;
    }
    componentWillReceiveProps(nextProps){
        //如果侧边栏 和 病人信息都打开了 则隐藏最右侧菜单 操作
        const {showSideBar,showPatientInfo} = nextProps.app;
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
        this.setState({cWidth:w,cHeight:h});
        const {kpData} = this.props.app;
        //this.setState({cWidth:w,cHeight:h,...kpData});
    }
    componentWillMount(){
        const {kpData} = this.props.app;
        this.setState({...kpData});
        this.second.fnMounseDown.call(this,'sss');
    }
    componentDidMount(){
        document.addEventListener('DOMMouseScroll', (e)=>{console.log('DOMMouseScroll');e.preventDefault();return false}, false);
        document.addEventListener('mousewheel',(e)=>{this.second.fnScroll.call(this)},{ passive: false });
        if(socket){
            socket.close()
        }
        socket = io();
        var w1 = TSC3D.offsetWidth;
        let canvas = document.getElementById("mycanvas");
        //canvas.width = dWidth - 550;
        //canvas.height = 600;
        let w = canvas.clientWidth;
        let h = canvas.clientHeight;

        this.glcanvas = GlCanvas.new("mycanvas", w, h, 12000, 15000);
        this.glcanvas.load_shaders();
        this.glcanvas.set_window(12000);
        this.glcanvas.set_level(15000);
        this.glcanvas.setup_geometry();
        this.glcanvas.render();

        console.log(ViewType.SAGITTAL || 'ssss' );
        console.log('window:',this.glcanvas.window);

        this.startListenSocket();
        this.setState({inited:true})
    }
    startListenSocket(){
        //下面开始监听websocket
        var arr = [];
        var i = 0;
        console.log(new Date());
        socket.on('chunk', (msg)=>{
            arr.push(this.base64ToUint8Array(msg));
            i++;
            console.log('我收到管理员的chunk了:'+i);
        });

        socket.on('chunk end',(msg)=>{
            console.log('我收到管理员的chunk end 了:',msg, arr.length);
            if(arr.length == msg.i){
                var dataBuffer = (this.concatArrayBuffer(arr)).buffer;//这里是arrayBuffer格式
                i = 0;
                arr = [];
                console.log('dataBuffer',dataBuffer);
                console.log(new Date());
                var array_view = new Uint16Array(dataBuffer);
                console.log("start of transforming...");
                array_view.forEach((element, index, array) => array[index] += 1000);
                console.log("end of transforming...");
                console.log("JS - Read file complished.");

                // this.glcanvas.load_primary(dataBuffer, 512, 512, 133);
                // // glcanvas.set_window(12000);
                // // glcanvas.set_level(15000);
                // // glcanvas.setup_geometry();
                // this.glcanvas.render();
                // this.props.dispatch({type:'setData',payload:{key:'loading',value:false}})
                // return;

                //接受到buffer后存起来 切换的时候不用再次去请求
                const {buffers} = this.props.app;
                buffers[msg.key] = dataBuffer;
                this.props.dispatch({type:'setData',payload:{key:'buffers',value:buffers}});

                const {curNode} = this.props.app;

                var timer = setTimeout(()=>{
                    if(curNode.level == 0){//如果点击的是病人 直接渲染
                        this.glRender({primary:msg.key});
                    }else{
                        //如果点击的是cbct
                        if(msg.level == 0){
                            this.glRender({primary:msg.key});
                            EventBus.emit('recieveEnd',true);
                        }else if(msg.level == 2){
                            this.glRender({primary:msg.pid,secondary:msg.key});
                        }
                    }
                    clearInterval(timer);
                },1000)
            }
        });
        EventBus.addListener('updateGl', (res)=>{
            console.log('====updateGl====',res);
            this.glRender(res);
        });
        EventBus.addListener('setGl', (res)=>{
            console.log('====setGl====',res);
            this.setGl(res.name,res.value,res['panXY']);
        });
    }
    glRender(obj){
        const {buffers} = this.props.app;
        var primaryKey = obj['primary'];
        if(primaryKey){
            this.glcanvas.load_primary(buffers[primaryKey], 1024, 1024, 3);
        }

        var secondaryKey = obj['secondary'];
        if(obj['secondary']){
            this.glcanvas.load_secondary(buffers[secondaryKey], 1024, 1024, 3);
        }

        this.glcanvas.set_blend(0.5);
        this.glcanvas.render();
        this.props.dispatch({type:'setData',payload:{key:'loading',value:false}});
    }
    render() {
        const {cWidth,cHeight,slider_blend,slider_window,slider_level,pan,slider_scale,slider_pan_x,slider_pan_y,slider_slice} = this.state;
        return (
                <div className="kelper page">
                    <canvas ref="canvas" id="mycanvas" width={cWidth} height={cHeight}
                            onMouseDown={this.second.fnMounseDown.bind(this)}
                            /*onMouseMove={this.second.fnMouseMove.bind(this)}*/
                            onMouseUp={this.second.fnMounseUp.bind(this)}
                    >
                    </canvas>
                    <div className="slide flex">
                        <input type="range" min="0" max="1.0" step="0.01" name="slider_blend" value={slider_blend} onChange={this.fnChange.bind(this)} className="slider" id="slider_blend"/>
                        <span>Blend</span>
                    </div>
                    {/*slider_window*/}
                    <div className="slide flex">
                        <input type="range" min="1" max="3000" name="slider_window" value={slider_window} onChange={this.fnChange.bind(this)} className="slider" id="slider_window"/>
                        <span>Window {slider_window}</span>
                    </div>
                    {/*slider_level*/}
                    <div className="slide flex">
                        <input type="range" min="0" max="3000" name="slider_level" value={slider_level}  onChange={this.fnChange.bind(this)} className="slider" id="slider_level"/>
                        <span>Level {slider_level}</span>
                    </div>
                    <form>
                        {/*pan*/}

                            <input type="radio" id="radio_transverse" name="pan" value="transverse" checked={pan=='transverse'} onChange={this.fnChange.bind(this)} />
                            <label htmlFor="transverse">Transverse</label>

                            <input type="radio" id="radio_sagittal" name="pan" value="sagittal" checked={pan=='sagittal'} onChange={this.fnChange.bind(this)}/>
                            <label htmlFor="transverse">Sagittal</label>


                            <input type="radio" id="radio_coronal" name="pan" value="coronal" checked={pan=='coronal'} onChange={this.fnChange.bind(this)}/>
                            <label htmlFor="transverse">Coronal</label>

                    </form>
                    {/*scale*/}
                    <div className="slide flex">
                        <input type="range" min="1" max="10" name="slider_scale" value={slider_scale} onChange={this.fnChange.bind(this)} step="0.1" className="slider" id="slider_scale"/>
                        <span>Zoom in/out</span>
                    </div>
                    {/*slider_pan_x*/}
                    <div className="slide flex">
                        <input type="range" min="-1" max="1" name="slider_pan_x" value={slider_pan_x} onChange={this.fnChange.bind(this)} step="0.01" className="slider" id="slider_pan_x"/>
                        <span>Pan: X</span>
                    </div>
                    {/*slider_pan_y*/}
                    <div className="slide flex">
                        <input type="range" min="-1" max="1" name="slider_pan_y" value={slider_pan_y} onChange={this.fnChange.bind(this)} step="0.01" className="slider" id="slider_pan_y"/>
                        <span>Pan: Y</span>
                    </div>
                    {/*slice*/}
                    <div className="slide flex">
                        <input type="range" min="0" max="1" name="slider_slice" value={slider_slice} onChange={this.fnChange.bind(this)} step="0.01" className="slider" id="slider_slice"/>
                        <span>Slice</span>
                    </div>
                </div>
        );
    }
}


export default kp;
