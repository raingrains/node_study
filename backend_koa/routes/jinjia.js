const  fs = require('fs')
const ExcelJS = require('exceljs')
const path = require('path')
const { resolve } = require('path')
const router = require('koa-router')();

router.prefix('/data')

router.get('/jinjia',async (ctx,next)=>{
   
   
   try {
	 const fileName = `/volume1/docker/qinglong/db/金价表/${ctx.request.query.time||'2024-08'}月金价.xlsx`
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(fileName);
    const worksheet = workbook.getWorksheet('Sheet1');
    const worksheetData = worksheet.getSheetValues().filter(item=>item.length >2).map(item=>item.slice(1))
    const responseData = worksheetData.slice(1).map(item=>({
        date: item[0],
        huishou: item[1],
        data: item[2]
    }))
     ctx.success(responseData);	
   }  catch(err){
   	ctx.error(500,'数据不存在')
   }
})


module.exports = router