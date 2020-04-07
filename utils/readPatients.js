/**
 * Created by miyaye on 2020/4/7.
 */
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

const Patient = require('./PatientModelOpt/patient');
const FilePath = require('./PatientModelOpt/filePath');

var num = 0;
var patientNames = [];
const _ = require('lodash');

/*新增path*/
 function addFilePath(patientName,fullpath) {
    const pat =  Patient.findOne({patientName}).then(async(patientRow)=>{
        const {_id} = patientRow;//病人id
        await  FilePath.add({
            patientName,
            patientId:_id,
            type:path.basename(fullpath),
            path:fullpath
        });
    });
}

function readFileList(dir, filesList = []) {
    const files = fs.readdirSync(dir);
    if(num == 0){
        patientNames = _.without(files,'.DS_Store');
        //循环病人 添加病人mongodb
        patientNames.forEach(pName=>{
            Patient.add({patientName:pName});
        });
    }
    num++;
    //console.log(num,files);
    //获取病人第一层目录 张三 , 李四
    var flag = true;
    files.forEach(async (item, index) => {
        var fullPath = path.join(dir, item);
        var patientName = _.intersection(patientNames,fullPath.split('/'))[0];
        if(!item.endsWith('.DS_Store')){
            if(path.basename(item).startsWith('ct-')){
                //这是ct 目录 add ct path
                //console.log('== ct-',path.join(dir, item));
                //addFilePath(patientName,item,fullPath)
            }
        }

        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            var files = fs.readdirSync(fullPath);
            //console.log('======',files.length,files);
            if(files.length == 1 && files[0].indexOf('.DS_Store')>0){
                //这就是最后的一层目录 只不过是个空目录 todo type 入库
                //addFilePath(patientName,item,fullPath)
                console.log('===空目录：',dir,item,fullPath)
            }
            //console.log('我是目录',dir);
            //const res = await addFilePath(patientName,dir,dir);
            readFileList(path.join(dir, item), filesList); //递归读取文件
        } else {
            if(flag){
                flag = false;
                if(path.basename(dir).startsWith('c') || path.basename(dir).startsWith('dcm')){
                    console.log('可以添加了',dir,path.basename(dir));
                    await addFilePath(patientName,dir);
                }
            }
            if(!item.endsWith('.DS_Store')){
                //最后一层目录 todo 入库

               //const res = await addFilePath(patientName,dir,dir);
                filesList.push(fullPath);
            }
        }
    });

    //console.log(files);
    return filesList;
}
var filesList = [];
readFileList(path.resolve(__dirname,'../../patients'),filesList);
//console.log(111,patientNames);
//console.log(filesList);