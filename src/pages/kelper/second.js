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
            //console.log(slider_pan_x,slider_pan_y);
            //var {slider_pan_x,slider_pan_y} = kpData;
            var slider_pan_x = kpData.slider_pan_x;
            var slider_pan_y = kpData.slider_pan_y;


            const fnMove = function(ev){

                //边界检测
                left = ev.clientX - disX - l;
                top = ev.clientY - disY - t;

                switch (action){
                    case 'pan':
                        if(left > 0){
                            if( slider_pan_x >= 1){
                                slider_pan_x = 1;
                                return;
                            }
                            slider_pan_x =  Math.floor((slider_pan_x +0.01)*1000)/1000;

                        }else{
                            if(slider_pan_x <= -1){
                                slider_pan_x = -1;
                                return
                            }
                            slider_pan_x = Math.floor((slider_pan_x -0.01)*1000)/1000;
                        }

                        if(top>0){
                            if(slider_pan_y >= 1){
                                slider_pan_y = 1;
                                return;
                            }
                            slider_pan_y  = Math.floor((slider_pan_y +0.01)*1000)/1000;
                        }else{
                            if(slider_pan_y <= -1){
                                slider_pan_y = -1;
                                return;
                            }
                            slider_pan_y  = Math.floor((slider_pan_y -0.01)*1000)/1000;
                        }
                        break;
                }

                console.log(slider_pan_x);
                kpData['slider_pan_x'] = slider_pan_x;
                kpData['slider_pan_y'] = slider_pan_y;

                EventBus.emit('setGl',{name:"slider_pan_x",value:slider_pan_x });
            };

            document.onmousemove = _.throttle(fnMove, 20);
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