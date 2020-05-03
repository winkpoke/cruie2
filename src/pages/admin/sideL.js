/**
 * Created by miyaye on 2020/4/10.
 */
import React, {Component} from 'react';
import {Tree} from 'antd';
import {connect} from 'react-redux';
import io from 'socket.io-client';
//import EventBus from
import Toast from '@/components/toast'
import { createFromIconfontCN } from '@ant-design/icons';
import EventBus from '@/utils/eventBus';
var socket = io()
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1763058_xbrna35m9w.js',
});

import {getPatientList} from "@/services/api";
import {getRes} from "@/utils";
import {base64ToUint8Array, concatArrayBuffer} from "@/utils/utils";

@connect((store) => {
    return {app:store.app,};
})
class SideL extends Component {
    constructor(props, context) {
        super(props, context);
        if(props.onRef){//如果父组件传来该方法 则调用方法将子组件this指针传过去
            props.onRef(this)
        }
    }

    state={
        treeData:[],
        selectedKeys:[],
        checkedKeys:[],
    };
    componentDidMount(){
        getPatientList().then(res=>{
            getRes(res,data=>{
                const handleIcon = (d)=>{
                    return  d.map(item=>{
                        //item.icon = <SmileOutlined />;
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
        this.props.dispatch({type:'setData',payload:{key:'loading',value:true}})
        console.log('selected', selectedKeys, info);
        var {dcmPath,level,path,key,pid} = info.node;
        //查看store中是否有当前key, 如果有则拿store的 如果没有则请求
        if(info.selected){
            this.props.dispatch({type:'setData',payload:{key:'curNode',value:info.node}});

            const {buffers} = this.props.app;
            if(key == this.props.app.currentKey) return;

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
                        //getRawFile({level,path ,key,pid });
                        //当primary 数据接受完毕再请求第二批数据
                        EventBus.addListener('recieveEnd', (res)=>{
                            this.props.dispatch({type:'setData',payload:{key:'loading',value:true}});
                            if(res) this.getRawFile({level,path ,key,pid });
                        })
                    }else{
                        this.getRawFile({level,path ,key,pid });
                    }
                }
            }
            //this.props.dispatch({type:'currentKey',value:key});
            this.startListenSocket()
        }
    };
    getRawFile(params){
        if(socket.connected){
            socket.emit('chunk',params)
        }else{
            socket = io()
            socket.emit('chunk',params)
        }
    }
    startListenSocket(){
        //下面开始监听websocket
        var arr = [];
        var i = 0;
        console.log(new Date());
        socket.on('chunk', (msg)=>{
            arr.push( base64ToUint8Array(msg));
            i++;
            console.log('我收到管理员的chunk了:'+i);
        });

        socket.on('chunk end',(msg)=>{
            console.log('我收到管理员的chunk end 了:',msg, arr.length);
            if(arr.length == msg.i){
                var dataBuffer = (concatArrayBuffer(arr)).buffer;//这里是arrayBuffer格式
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
                     socket.close()
                    if(curNode.level == 0){//如果点击的是病人 直接渲染
                        //this.glRender({primary:msg.key});
                        EventBus.emit('updateGl',{primary:msg.key})
                    }else{
                        //如果点击的是cbct
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
        });

        // EventBus.addListener('setGl', (res)=>{
        //     console.log('====setGl====',res);
        //     this.setGl(res.name,res.value,res['panXY']);
        // });
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

export default SideL;
