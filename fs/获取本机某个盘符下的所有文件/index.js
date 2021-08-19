const fs = require('fs')

let index=0
// console.log(fs.readdirSync("F:/ce shi/"))

// 判断是目录还是文件
// console.log(fs.lstatSync('E:/软件/Thunder/Program/resources/bin/TBC/Data/Cookies').isDirectory());
// console.log(fs.lstatSync('E:/软件/Thunder/Program/resources/bin/TBC/Data').isDirectory());

function readFileMessage(path,pid){
  return fs.readdirSync(path).map(file=>{
    index++
    if(file.indexOf('.')===-1 && !['System Volume Information','node_modules'].includes(file)){
      if(fs.lstatSync(path+file).isDirectory()){
        return {
          pid,
          id:index,
          name:file,
          path:path+file,
          children:[...readFileMessage(path+file+'/',index)]
        }
      }
    }else{
      return {
        pid,
        id:index,
        name:file,
        path:path+file,
      }
    }
    
  })
}

fs.writeFileSync('D盘数据.json',JSON.stringify(readFileMessage('D:/',0)))
console.log(index);


// console.log(fs.lstatSync('F:/web前端/electron/electron/demo/package.json'));