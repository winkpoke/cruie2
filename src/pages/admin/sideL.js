/**
 * Created by miyaye on 2020/4/10.
 */
import React, {Component} from 'react';
import {Tree} from 'antd';
import {connect} from 'react-redux';

import {getPatientList} from "../../services/user";
import {getRes} from "@/utils";
const { TreeNode } = Tree;
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
                this.setState({treeData:data})
            })
        })
    }
    onSelect(selectedKeys, info){
        console.log('selected', selectedKeys, info);
        this.setState({selectedKeys});
    };
    onCheck(checkedKeys, info){
        console.log('onCheck', checkedKeys, info);
        //const {checkedKeys:orgCks, selectedKeys} = this.state;
        this.setState({checkedKeys});

        this.props.dispatch({type:'setData',payload:{key:'curRow',value:info.checked ? info.node : null}})
    };
    render() {
        const {treeData,checkedKeys, selectedKeys} = this.state;
        return (
            <div className="sideL">
                {treeData.length > 0 ? <Tree
                    checkable
                    checkedKeys={checkedKeys}
                    selectedKeys={selectedKeys}
                    onSelect={this.onSelect.bind(this)}
                    onCheck={this.onCheck.bind(this)}
                    treeData={treeData}
                /> : '' }

            </div>
        );
    }
}

export default SideL;
