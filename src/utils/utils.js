export const getRes = (res, fnSuccess, fnFail)=>{
    const response = res;
    const {data,code, status  } = response;
    if (code==200 || code==0 || status=='success' ) {
        console.log('ssss',data)
        fnSuccess&&fnSuccess(data)
    } else {
        fnFail&&fnFail(status);
    }
};

export const guid = function() {
    return Number(Math.random().toString().substr(3, 3) + Date.now()).toString(36);
};

export function canclebubble(event){
    var event = event||window.event;        //兼容火狐
    if(event.stopPropagation){
        event.stopPropagation();            //标准浏览器
    }else{
        event.cancaleBubble==true;          //老ie
    }
}

export function hasClass(elem, cls){
    cls = cls || '';
    if(cls.replace(/\s/g, '').length == 0) return false;
    return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
}

export function addClass(elem, cls){
    if(!hasClass(elem, cls)){
        elem.className += ' ' + cls;
    }
}

export function removeClass(elem, cls){
    if(hasClass(elem, cls)){
        var newClass = ' ' + elem.className.replace(/[\t\r\n]/g, '') + ' ';
        while(newClass.indexOf(' ' + cls + ' ') >= 0){
            newClass = newClass.replace(' ' + cls + ' ', ' ');
        }
        elem.className = newClass.replace(/^\s+|\s+$/g, '');
    }
}

export function transformStr2Obj(a={},str) {
    var i = 0;
    var arr = str.split('.');
    var len = arr.length;
    var lastLevalObj = ""

    function test(obj){
        var attr = arr[i];
        if( i< len){
            if(!obj[attr]){
                if(i == len-1){
                    obj[attr] = "";
                    lastLevalObj = obj
                }else{
                    obj[attr]= {};
                    i++;
                    test(obj[attr])
                }
            }else{
                if(i==len-1){
                    lastLevalObj = obj;
                }
                i++;
                test(obj[attr])
            }
        }
    }
    test(a);
    return {
        orgObj:a,
        lastLevalObj:  lastLevalObj
    }
}

export function  debounce(fn, wait){
    var timeout = null;      //定义一个定时器
    return function() {
        if(timeout !== null)
            clearTimeout(timeout);  //清除这个定时器
        timeout = setTimeout(fn, wait);
    }
}

export function throttle(fn,ev,delay){
    let valid = true
    return function() {
        if(!valid){
            //休息时间 暂不接客
            return false
        }
        // 工作时间，执行函数并且在间隔期内把状态位设为无效
        valid = false;
        setTimeout(() => {
            fn(ev)
            valid = true;
        }, delay)
    }
}

export function concatArrayBuffer(arr){
    var arr1 = [];
    arr.map((arrayBuffer,index)=>{
        arr1.push(Buffer.from(arrayBuffer));
        return arrayBuffer
    });
    return Buffer.concat(arr1)
}
export function base64ToUint8Array(base64String) {
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