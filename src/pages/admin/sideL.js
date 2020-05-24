/**
 * Created by miyaye on 2020/4/10.
 */
import React, {Component} from 'react';
import {Tree} from 'antd';
import {connect} from 'react-redux';
import {Route, Link, Redirect, withRouter} from "react-router-dom";
// import io from 'window.ws.io-client';
//import EventBus from
import { createFromIconfontCN } from '@ant-design/icons';
import EventBus from '@/utils/eventBus';
// var window.ws = io()

import {Archive} from 'libarchive.js/main.js';

Archive.init({
    workerUrl: '/static/libarchive/worker-bundle.js'
});
// const WebSocket = require('window.ws');
// const window.ws = new WebSocket('ws://localhost:3003/chunk');
// window.ws.binaryType = 'arraybuffer';

const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1763058_xbrna35m9w.js',
});

import {getPatientList} from "@/services/api";
import {getRes} from "@/utils";
import {base64ToUint8Array, concatArrayBuffer} from "@/utils/utils";
import {usedTime} from "../../utils/utils";
var config = require('../../../config/index')
@connect((store) => {
    return {app:store.app,};
})
class SideL extends Component {
    constructor(props, context) {
        console.log('===aaa=====',props)
        super(props, context);
        if(props.onRef){//如果父组件传来该方法 则调用方法将子组件this指针传过去
            props.onRef(this)
        }
        this.host = props.location.search.indexOf('dev') > 0 ? config.host  : config.prdHost
    }
    state={
        treeData:[],
        selectedKeys:[],
        checkedKeys:[],
    };

    connect(){
        // if(!window.ws){
        //     window.ws = new WebSocket(`ws://${this.host}`);
        //     window.ws.binaryType = 'arraybuffer'
        //     window.ws.onclose= (e)=>{
        //         console.log('关闭',e)
        //     }
        // }
    }
    componentDidMount(){
        getPatientList().then(res=>{
            getRes(res,data=>{
                const handleIcon = (d)=>{
                    return  d.map(item=>{
                        item.icon = ({ selected }) => (selected ? <IconFont type="icon-baseline-check_box-px"/> : <IconFont type="icon-check-box-outline-bl" />);
                        if(item.children){
                            handleIcon(item.children);
                            return item;
                        }
                        return item;
                    });
                };
                this.props.dispatch({type:'setData',payload:{key:'treeData',value:data}});
                this.setState({treeData:handleIcon(data)})
            })
        })
    }
    async onSelect(selectedKeys, info){
        //查看store中是否有当前key, 如果有则拿store的 如果没有则请求
        if(info.selected){
            const {buffers} = this.props.app;
            var {dcmPath,level,path,key,pid , detail:{shift}} = info.node;

            this.props.dispatch({type:'setData',payload:{key:'curNode',value:info.node}});
            if(shift){
                var {kpData} = this.props.app
                kpData['slider_shift_x'] = shift['slider_shift_x']
                kpData['slider_shift_y'] = shift['slider_shift_y']
                kpData['slider_shift_z'] = shift['slider_shift_z']
                this.props.dispatch({type:'setData',payload:{key:'kpData',value:kpData}});
            }

            if(key == this.props.app.currentKey) return;
            this.props.dispatch({type:'setData',payload:{key:'loading',value:true}})
            //this.connect()
            if(buffers[key]){
                //病人
                //拿了store的需要通知重新渲染
                if(level == 0){
                    EventBus.emit('updateGl',{primaryKey:key});
                }else if(level == 2){
                    //cbct
                    EventBus.emit('updateGl',{primaryKey:key,secondary:pid});
                }
            }else{
                if(level == 0){
                    this.getRawFile({dcmDir:dcmPath,level,path ,key });
                }else if(level == 2){
                    const {treeData} = this.state;
                    var parent = treeData.find(item=>item.key == pid);
                    if(!buffers[pid]){
                        this.getRawFile({dcmDir:parent.dcmPath,level:parent.level, key:pid });
                        //当primary 数据接受完毕再请求第二批数据
                        EventBus.addListener('recieveEnd', (res)=>{
                            console.log('primary over')
                            this.props.dispatch({type:'setData',payload:{key:'loading',value:true}});
                            this.getRawFile({level,path ,key,pid });
                        })
                    }else{
                        this.getRawFile({level,path ,key,pid });
                    }
                }
            }
            this.props.dispatch({type:'setData',payload:{key:'currentKey',value:key}});
            this.startListenSocket()
        }
    };
    getRawFile(params){
        console.log('getRawFile')
        params['type'] = 'chunk';
        if(window.ws.readyState == 3){
            this.connect()
            window.ws.addEventListener('open',  (evt) => {
                window.ws.send(JSON.stringify(params))
                this.startListenSocket()
            })
        }else{
            window.ws.send(JSON.stringify(params))
        }
    }
    startListenSocket(){
        //下面开始监听websocket
        var arr = [];
        var i = 0;
        var startTime = new Date();
        window.ws.addEventListener('message', (event) => {
            var data = event.data
            if( !(event.data.constructor == ArrayBuffer || JSON.parse(event.data).type =='end')) return
            if( data.constructor == String){
                var msg = JSON.parse(data)
                var endTime = new Date();
                console.log( usedTime(startTime, endTime))
                this.chunkEnd(msg,arr,i)
                // window.ws.close()
            }else {
                arr.push(data);
                i++;
                console.log('我收到管理员的chunk了:'+i);
            }
        });


    }
    chunkEnd = async (msg,arr, i) => {
    console.log('我收到管理员的chunk end 了:',msg, arr.length);
    if(arr.length == msg.i){
        var dataBuffer = (concatArrayBuffer(arr)).buffer;//这里是arrayBuffer格式
        var blob = new Blob([dataBuffer], {type: 'application/octet-stream'});
        var file = new File([blob],'a.zip');
        const archive = await Archive.open(file);
        console.log('开始解压')
        let obj = await archive.extractFiles();
        console.log('解压结果:',obj)

        var rawFile = obj['data_dcm.raw']
        console.log('rawFile:',rawFile,obj)
        var reader = new FileReader();
        reader.readAsArrayBuffer(rawFile);
        reader.onload = function(e){
            let buffer = e.target.result  //此时是arraybuffer类型
            startHandleArrayBuffer(buffer)
        }

        const startHandleArrayBuffer = (dataBuffer)=>{
            i = 0;
            arr = [];

            var array_view = new Uint16Array(dataBuffer);
            console.log("start of transforming...");
            array_view.forEach((element, index, array) => array[index] += 1000);
            console.log("end of transforming...");
            console.log("JS - Read file complished.");

            //接受到buffer后存起来 切换的时候不用再次去请求
            const {buffers} = this.props.app;
            buffers[msg.key] = dataBuffer;
            this.props.dispatch({type:'setData',payload:{key:'buffers',value:buffers}});

            const {curNode} = this.props.app;

            var timer = setTimeout(()=>{
                if(curNode.level == 0){//如果点击的是病人 直接渲染
                    //this.glRender({primary:msg.key});
                    EventBus.emit('updateGl',{primary:msg.key})
                    //
                }else{
                    // 如果点击的是cbct
                    if(msg.level == 0){
                        //this.glRender({primary:msg.key});
                        EventBus.emit('updateGl',{primary:msg.key})
                        EventBus.emit('recieveEnd',true);
                    }else if(msg.level == 2){
                        //this.glRender({primary:msg.pid,secondary:msg.key});
                        EventBus.emit('updateGl',{primary:msg.pid,secondary:msg.key})
                    }
                }
                clearInterval(timer);
            },1000)
        }
    }
}
    render() {
        const {treeData} = this.state;
        return (
            <div className="sideL">
                {treeData.length > 0 ? <Tree
                    showIcon
                    onSelect={this.onSelect.bind(this)}
                    treeData={treeData}
                    multiple={false}
                /> : '' }

            </div>
        );
    }
}

export default withRouter(SideL);
