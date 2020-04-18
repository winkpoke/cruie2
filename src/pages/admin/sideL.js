/**
 * Created by miyaye on 2020/4/10.
 */
import React, {Component} from 'react';
import {Tree} from 'antd';
import {connect} from 'react-redux';
//import EventBus from
import { createFromIconfontCN } from '@ant-design/icons';
import EventBus from '@/utils/eventBus';
const IconFont = createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/font_1763058_xbrna35m9w.js',
});

import {getPatientList,getRawFile} from "@/services/api";
import {getRes} from "@/utils";
import {
    DownOutlined,
    FrownOutlined,
    SmileOutlined,
    MehOutlined,
    FrownFilled,
} from '@ant-design/icons';
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
                    await getRawFile({dcmDir:dcmPath,level,path ,key });
                }else if(level == 2){
                    const {treeData} = this.state;
                    var parent = treeData.find(item=>item.key == pid);
                    if(!buffers[pid]){
                        await  getRawFile({dcmDir:parent.dcmPath,level:parent.level, key:pid });
                        //getRawFile({level,path ,key,pid });
                        //当primary 数据接受完毕再请求第二批数据
                        EventBus.addListener('recieveEnd', (res)=>{
                            if(res) getRawFile({level,path ,key,pid });
                        })
                    }else{
                        getRawFile({level,path ,key,pid });
                    }
                }
            }
            //this.props.dispatch({type:'currentKey',value:key});

        }
    };
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
