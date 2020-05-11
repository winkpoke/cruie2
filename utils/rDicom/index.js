const fs = require('fs');
const path = require('path');
const parseFile = require('./parseFile');
var PatientModel = require('../../model/Patient');
var FilPathModel = require('../../model/FilePath');
var _ = require('lodash')

/*读取dicom文件*/
//var dirPath = path.resolve(__dirname,'../../../patients/李四/ct-20200408/dcm');
async function readDicom(dir) {
    var allP = [];
    var dcmRawDir = path.resolve(dir,'../dcmRaw');
    if(!fs.existsSync(dcmRawDir)) fs.mkdirSync(dcmRawDir);
    let data_dcm_raw = dcmRawDir+'/data_dcm.raw';
    fs.writeFileSync(data_dcm_raw,'');

    //根据当前dir 获取病人行
    // console.log('===dir===',dir);
    try{
        const num = await FilPathModel.countDocuments({path:dir}).exec();
        if(num > 0){
            const fileRow = await FilPathModel.find({path:dir}).exec();
            const {patientId} = fileRow[0];
            // console.log('====patientId===',patientId);
            var files = fs.readdirSync(dir);
            // console.log('=====files len==',files.length);
            files = _.without(files,'.DS_Store');
            files.forEach( async (item,index)=>{
                var fullPath = path.join(dir, item);
                const d = fs.readFileSync(fullPath);
                allP.push(parseFile(d));
                if(index == 0){//获取第一张图片信息
                    var image = await parseFile(d);
                    //console.log(image);
                    const {rows,columns,patinfo} = image[1];
                    PatientModel.findByIdAndUpdate(patientId,{detail: {rows,columns,patinfo}},(err,doc)=>{
                        if(err){
                            console.log('===err===',err);
                            throw err;
                        }
                        //console.log(doc)
                    })
                }
            });
            return await Promise.all(allP).catch(e=>{
                console.log('==sdfsdf==')
            });
        }
    }catch (e){
        console.log('===err===',e)
    }

}

async function getAllPixelArraybuffer(dir)
{
    try{
        var imagestack = await readDicom(dir);
        if(!imagestack){
            console.log('==imagestack==',imagestack);
            return;
        }
        var a=[];
        var t = "other type";
        for (var i = 0; i < imagestack.length; i++)
        {
            var b = imagestack[i][1].getPixelData;

            var c=[];
            for( var j in b )
            {
                c.push(b[j]);
            }

            var buffer;
            if( b instanceof Uint16Array){
                t = "Uint16Array";
                buffer = new Uint16Array(c).buffer;
            }
            else if(b instanceof Int16Array){
                t = "Int16Array";
                buffer = new Int16Array(c).buffer;
            }
            else if( b instanceof Uint8Array){
                t = "Uint8Array";
                buffer = new Uint8Array(c).buffer;
            }
            else if(b instanceof Int8Array){
                t = "Int8Array";
                buffer = new Int8Array(c).buffer;
            }
            else if( b instanceof Float32Array){
                t = "Float32Array";
                buffer = new Float32Array(c).buffer;
            }
            a.push(buffer);
        }
        return a;
    }catch (e){
        return [];
        console.log(e)
    }

}

async function fnWriteFile(fullpath) {
    const arrayBuffer = await getAllPixelArraybuffer(fullpath);
    // console.log('arrayBufer:',arrayBuffer,'| fullpath:',fullpath);
    var dirName = path.basename(fullpath);
    console.log('===writeFile===',dirName);
    if(!arrayBuffer){
        return;
    }

    if(dirName == 'dcm'){
        var data_dcm_raw = path.resolve(fullpath,'../dcmRaw/data_dcm.raw');
        console.log(data_dcm_raw,fs.existsSync(data_dcm_raw))
       var fd= fs.openSync(data_dcm_raw,'w');
        console.log('打开文件:'+data_dcm_raw,fd);
        arrayBuffer.forEach((item,index)=>{
            fs.writeSync(fd, Buffer.from(item));
            if(index == arrayBuffer.length -1){
                fs.closeSync(fd);
                console.log("操作完毕，关闭文件:"+data_dcm_raw,fd);

                const compressing = require('compressing');
                const target = path.resolve(fullpath,'../dcmRaw/data_dcm.raw.zip');
                //const target = path.resolve(fullpath,'data_dcm.raw.gz');
                compressing.zip.compressFile(data_dcm_raw, target)
                    .then(() => {
                        console.log('compress success:'+fullpath);
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        });
    }
}

//readDicom()

//获取.raw文件
//fnWriteFile();

module.exports = {
    getAllPixelArraybuffer,
    readDicom,
    fnWriteFile,
};
