export default function reducer(state={
    showSideBar:true,//默认显示目录
    showPatientInfo:false,//默认不显示病人信息
    buffers:{},//前端存放buffer
    currentKey:"",
    curNode:{},//当前选中节点
    tsc:"", // transverse sagittal coronal
    action:"slice",//scale,pan,slice
    kpData:{
        slider_blend:0.5,
        slider_window:18500,
        slider_level:12000,
        pan:"transverse",
        slider_scale:1,
        slider_pan_x:0,
        slider_pan_y:0,
        slider_slice:0
    },
    options:{
        formData:{},
        formItem:[],
        formProps:{
            'label-width': 60
        },
    },
}, action) {
    switch (action.type) {
        case "setData": {
            const {key,value} = action.payload;
            var obj = {};
            obj[key] = value;
            return {...state, ...obj }
        }
    }
    return state
}
