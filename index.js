#! node
/**
 * @description 命令工具下载supreme 脚手架代码
 * @auth lei.you
 * @date 2018/3/5
 * */
console.log('supreme-cli start....................');
var exec = require('child_process').exec;
var program = require('commander');
var copydir = require('copy-dir');
var fs = require('fs');
var path = require('path');
//当前执行程序的路径（执行命令行时候的路径,不是代码路径 例如 在根目录下执行 node ./xxx/xxx/a.js 则 cwd 返回的是 根目录地址 ）
//console.log(process.execPath)
//__dirname: 代码存放的位置
//console.log(__dirname)
//当前执行的node路径（如：/bin/node）
///console.log(process.cwd())
exec("git clone git@git.nevint.com:arthur/supreme.git",function(error){
    if(!error){
        var supremePath= path.join(process.cwd(),"/supreme") ;
        fs.readdir(supremePath,function(error,files){
            var loop=0;
            for(var i=0;i<files.length;i++){
                var file=files[i];
                var filePath=path.join(supremePath,file);
                var stat = fs.statSync(filePath)
                if (error) {
                    console.error(error);
                    throw error;
                }
                if(stat.isDirectory()){
                    if(filePath.indexOf(".git")==-1){
                        copydir(filePath,path.join(process.cwd(),file),function(err){
                            ++loop;
                            if(loop==files.length-1){
                                deleteFolder(supremePath);
                            }
                            if(error){
                                console.error(error);
                                throw error;
                            }
                        })
                    }
                }else{
                    //console.log('file:'+filePath);

                    var readStream = fs.createReadStream(filePath);
                    var writeStream = fs.createWriteStream(path.join(process.cwd(),file));
                    var result = readStream.pipe(writeStream);
                    ++loop;
                    if(loop==files.length-1){
                        deleteFolder(supremePath);
                    }

                }

            }
        });
        //
    }
})


function deleteFolder(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
}
