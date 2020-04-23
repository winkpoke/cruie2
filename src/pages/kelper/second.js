/**
 * Created by miyaye on 2020/4/19.
 */
import React, {Component} from 'react';
import helper from '@/utils/helper';
import {debounce} from '@/utils/utils';
import EventBus from '@/utils/eventBus';
import _ from 'lodash';
function getDisXY(pos,ev) {
    var disX=0;
    var disY=0;
    var {myCanvasSideLXStart, myCanvasSideLXEnd, myCanvasSideRXStart, myCanvasSideRXEnd, startLineY, middleLineY, endLineY, tsc} = pos;
    switch (tsc){
        case 'transverse':
            disX = ev.clientX-myCanvasSideLXStart;
            disY = ev.clientY - startLineY;
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
        if(this.state.inited){
            console.log('down');
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
            const {kpData} = this.props.app;
            //console.log('fnDown disXY:',disX,disY);

            var left,top;
            var slider_pan_x = kpData.slider_pan_x;
            var slider_pan_y = kpData.slider_pan_y;

            var i = 0;
            const fnMove = function(ev){
                //边界检测
                left = ev.clientX - disX - l;
                top = ev.clientY - disY - t;

                var isMovingH = Math.abs(left) - Math.abs(top);

                switch (action){
                    case 'pan':
                        if(isMovingH > 0){
                            if(left > 0){
                                if( slider_pan_x >= 1){
                                    slider_pan_x = 1;
                                    return;
                                }
                                slider_pan_x =  (parseInt(slider_pan_x*100 + 100*0.01))/100;

                            }else{
                                if(slider_pan_x <= -1){
                                    slider_pan_x = -1;
                                    return
                                }
                                slider_pan_x =  (parseInt(slider_pan_x*100 - 100*0.01))/100;
                            }
                            this.setGl('slider_pan_x',slider_pan_x);
                        }else{
                            //垂直方向 -1 to 1: - 代表+
                            if(top<0){
                                if(slider_pan_y >= 1){
                                    slider_pan_y = 1;
                                    return;
                                }
                                slider_pan_y  =  (parseInt(slider_pan_y*100 + 100 * 0.01))/100;

                            }else{
                                if(slider_pan_y <= -1){
                                    slider_pan_y = -1;
                                    return;
                                }
                                slider_pan_y  =  (parseInt(slider_pan_y*100 - 100 * 0.01))/100;
                            }
                            this.setGl('slider_pan_y',slider_pan_y);
                        }
                    break;
                }
                console.log(slider_pan_x,slider_pan_y);
                //this.setGl('','',[slider_pan_x,slider_pan_y])
            };

             document.onmousemove = _.throttle(fnMove.bind(this), 10);
            //document.onmousemove = fnMove.bind(this);
            document.onmouseup = (ev)=>{
                // left = ev.clientX - disX - l;
                // top = ev.clientY - disY - t;
                // console.log('fnUp left top:',left,top);
                document.onmousemove=document.onmouseup=null
            };
        }
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