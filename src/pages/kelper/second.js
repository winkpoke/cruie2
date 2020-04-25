/**
 * Created by miyaye on 2020/4/19.
 */
import React, {Component} from 'react';
import helper from '@/utils/helper';
import {debounce} from '@/utils/utils';
import EventBus from '@/utils/eventBus';
import _ from 'lodash';

var left = 0,top = 0  ;
function getDisXY(pos,ev) {
    var disX=0;
    var disY=0;
    var {myCanvasSideLXStart, myCanvasSideLXEnd, myCanvasSideRXStart, myCanvasSideRXEnd, startLineY, middleLineY, endLineY, tsc} = pos;
    switch (tsc){
        case 'transverse':
            disX = ev.clientX-myCanvasSideLXStart ;
            disY = ev.clientY - startLineY   ;
            break;
        case 'sagittal':
            disX = ev.clientX - myCanvasSideRXStart;
            disY = ev.clientY - startLineY;
            break;
        case 'coronal':
            disX = ev.clientX - myCanvasSideRXStart;
            disY = ev.clientY - middleLineY;
            break;
    }
    return {disX,disY}
}

export default class Second extends Component{
    fnMounseDown(){
        var _this = this;
        console.log(_this.glcanvas);
        if(this.state.inited){
            console.log('down left-top:',left,top);
            var ev= event;
            var pos = this.fnGetPos(ev.clientX,ev.clientY);
            const {myCanvasSideLXStart, myCanvasSideLXEnd, myCanvasSideRXStart, myCanvasSideRXEnd, startLineY, middleLineY, endLineY, tsc} = pos;
            var {action} = this.props.app;
            var l,t;
            switch (tsc){
                case 'transverse':
                    l = myCanvasSideLXStart;
                    t = startLineY;
                    break;
                case 'sagittal' :
                    l = myCanvasSideRXStart;
                    t = startLineY;
                    break;
                case 'coronal':
                    l = myCanvasSideRXStart;
                    t = middleLineY;
                    break;
            }
            const {disX,disY} = getDisXY(pos,ev);

            var transformdX =  parseInt( (disX) * 1000 / 315 )/1000 - 1;
            var transformdY =  1 - parseInt( (disY) * 1000 / 315 )/1000 ;

            _this.glcanvas[`set_pan_transverse_x`](transformdX);
            _this.glcanvas[`set_pan_transverse_y`](transformdY);
            _this.glcanvas.render();
            _this.setState({name:'alice'});

            //const {kpData} = this.props.app;
            console.log('fnDown disXY:',disX,disY);

             document.onmousemove = function (ev) {
                 const {disX,disY} = getDisXY(pos,ev);
                 var  transformdX =  parseInt( (disX) * 1000 / 315 )/1000 - 1;
                 var  transformdY =  1 - parseInt( (disY) * 1000 / 315 )/1000 ;
                 console.log(helper.decimal2(transformdX), helper.decimal2(transformdY));
                 _this.glcanvas[`set_pan_transverse_x`](transformdX);
                 _this.glcanvas[`set_pan_transverse_y`](transformdY);
                 _this.glcanvas.render();
                 _this.setState({name:'alice'});
             };
            document.onmouseup = (ev)=>{
                document.onmousemove=document.onmouseup=null;
            };
        }
    }
    renderGl(){

    }
    fnMouseMove(){
        console.log('move')
    }
    fnMounseUp(){
        console.log('mounseUp')
    }
    fnScroll(){
        var ev = window.event;
        if(ev.wheelDelta){//IE/Opera/Chrome
             //console.log(ev.wheelDelta);
        }else if(ev.detail){//Firefox
             //console.log(ev.detail);
        }
        window.event.preventDefault();
        return false;
    }
    fnGetPos(x,y){//鼠标位置
        var myCanvas = document.getElementById('mycanvas');
        var pcont = document.getElementById('pcont');
        var myCanvasWidth = myCanvas.width;
        var myCanvasHeight = myCanvas.height;
        var myCanvasOffsetTop = document.getElementById('head-nav').offsetHeight;
        var tsc = "";

        //左边的
        var myCanvasSideLXStart = pcont.offsetLeft + myCanvas.offsetLeft;
        var myCanvasSideLXEnd = pcont.offsetLeft + myCanvas.offsetLeft + parseInt(myCanvasWidth/3)*2;

        var myCanvasSideRXStart = pcont.offsetLeft + myCanvas.offsetLeft + parseInt(myCanvasWidth/3)*2 + 1;
        var myCanvasSideRXEnd = pcont.offsetLeft + myCanvas.width + myCanvas.offsetLeft;
        var middleLineY = myCanvasOffsetTop + myCanvasHeight/2;
        var startLineY = myCanvasOffsetTop;
        var endLineY = myCanvasOffsetTop + myCanvasHeight;

        //console.log(x,y);

        if(x < myCanvasSideLXEnd){
            tsc = 'transverse'
        }else{
            if(y <middleLineY){
                tsc = "sagittal"
            }else{
                tsc = "coronal"
            }
        }

        this.props.dispatch({type:'setData',payload:{key:'tsc',value:tsc}});

        return {
            myCanvasSideLXStart,
            myCanvasSideLXEnd,
            myCanvasSideRXStart,
            myCanvasSideRXEnd,
            startLineY,
            middleLineY,
            endLineY,
            tsc
        }
    }
    fnCheckTsc(pos){

    }
    fnScale(){

    }
    fnPan(){

    }
    fnSlice(){

    }
}