/**
 * Created by miyaye on 2020/5/17.
 */
const chokidar = require('chokidar');
const {createDocs,copyDir} = require('./fileHelper')
const path = require('path')
const Patient = require('./PatientModelOpt/patient');
const {readFileList} = require('./readPatients')
const _ = require('lodash')
// One-liner for current directory
var watchDir = '../patient-source'
var distDir = '../patients'
const watcher = chokidar.watch(watchDir);
var timer = setTimeout(()=>{
     watcher.on('all', async (event, pathInfo) => {
         if(event=='addDir'){
             console.log(event, pathInfo);
             var distPath = pathInfo.replace(watchDir,distDir);
             var arr = pathInfo.split('/')
             var patientName = arr[2];
             createDocs(pathInfo, distPath);

             if(arr.length == 3){
                   await  Patient.add({patientName:patientName})
                   var timer = setTimeout(()=>{
                       readFileList(path.resolve(distDir,patientName))
                       clearInterval(timer)
                   },3000)
             }
         }
     });
    clearInterval(timer)
},2000)
