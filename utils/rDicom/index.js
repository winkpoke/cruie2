const fs = require('fs');
const path = require('path');
const parseFile = require('./parseFile');
var PatientModel = require('../../model/Patient');
var FilPathModel = require('../../model/FilePath');

var allP = [];
/*读取dicom文件*/
async function readDicom(dir="/private/var/www/frontend/patients/李四/ct-1/dcm") {
    //根据当前dir 获取病人行
    console.log('===dir===',dir);
    try{
        const num = await FilPathModel.countDocuments({path:dir}).exec();
        if(num > 0){
            const fileRow = await FilPathModel.find({path:dir}).exec();
            const {patientId} = fileRow[0];
            console.log('====patientId===',patientId);
            const files = fs.readdirSync(dir);
            //console.log('=====files len==',files.length);
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
            return await Promise.all(allP);
        }
    }catch (e){
        console.log('===err===',e)
    }

}

async function getAllPixelArraybuffer(dir="/private/var/www/frontend/patients/李四/ct-1/dcm")
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
        console.log("All pixels: ", a);

        return a;
    }catch (e){
        return [];
        console.log(e)
    }

}

async function fnWriteFile() {
    const arrayBuffer = await getAllPixelArraybuffer();
    console.log('arrayBufer',arrayBuffer);
    //fs.writeFileSync('./static/a.raw',Buffer.from(arrayBuffer),'binary');
    if(!arrayBuffer){
        console.log('==arrayBuffer==',arrayBuffer)
        return;
    }
    arrayBuffer.forEach(item=>{
        fs.appendFile('./static/a.raw', Buffer.from(item),'binary', function (err) {
         if (err) {
            throw(err);
         } else {
         return(arrayBuffer.length);
         }
         });
    })
}

//readDicom()

//获取.raw文件
fnWriteFile();

module.exports = {
    //getAllPixelArraybuffer,
    readDicom,
    fnWriteFile,
};