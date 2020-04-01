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
}

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