const promisePool = require('../utils/database');
const router = require('koa-router')();

router.prefix('/data');

// 新增金价记录
router.post('/jinjia_adds', async (ctx, next) => {
  //  参数为数组形式 [{ date: '2024-08-01 00:00:01', huishou: 500, data: 1000 }, { date: '2024-08-02 00:00:01', huishou: 510, data: 1010 }]

  const {data} =typeof ctx.request.body === 'string' ? JSON.parse(ctx.request.body) : ctx.request.body;

  // 检查参数格式
  if (!Array.isArray(data) || data.length === 0) {
    ctx.error(400, '参数格式错误');
    return;
  }
  // 检查每个对象的格式
  for (const item of data) {
    if (!item.data || !item.huishou || !item.data) {
      ctx.error(400, '参数格式错误');
      return;
    }

    // 检查日期格式
    const datePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (!datePattern.test(item.date)) {
      ctx.error(400, '日期格式错误');
      return;
    }

  }
  // 使用sql语句批量插入数据
  const sql = 'INSERT INTO jinjia (date, huishou, data) VALUES ?';
  const values = data.map(item => [item.date, item.huishou, item.data]);
  console.log(values);
  try {
    const [result] = await promisePool.query(sql, [values]);
    if(data.length > 1){
      ctx.success({
        successful: true,
      });
    }else{
      ctx.success({
        id: result.insertId,
      });
    }
  
  } catch (err) {
    console.error('Database insert failed:', err);
    ctx.error(500, '记录新增失败');
  }
  
});

router.get('/jinjia', async (ctx, next) => {
    // 初始化参数
    const defaultTimes = ['2024-08-15', '2024-08-31'];
    const times = ctx.request.query.time ? ctx.request.query.time.split('/') : defaultTimes;
    console.log(times);

    let step = 1; // 步长

    // 计算两个日期之间的天数差
    const startDate = new Date(times[0]);
    const endDate = new Date(times[1]);
    const timeDiff = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 转换为天数

    // 设置步长的值 规则： 天数差除以30的值+1
    if (diffDays > 30) {
      step = Math.ceil(diffDays / 30);
    }

    // 查询数据库
    try {
      const query = `
        SELECT date, huishou, data
        FROM (
        SELECT *, ROW_NUMBER() OVER (ORDER BY date ASC) AS row_num
        FROM jinjia
        WHERE date BETWEEN ? AND ?
        ) AS subquery
        WHERE (row_num - 1) % ? = 0
      `;

      const [rows] = await promisePool.query(query, [times[0], times[1], step]);

      // 返回结果
      ctx.success({
        data: rows,
        step,
      });
    } catch (err) {
      console.error('Database query failed:', err);
      ctx.error(500, '数据查询失败');
    }

    // 原注释代码
    // try {
    //  const fileName = `/volume1/docker/qinglong/db/金价表/${ctx.request.query.time}月金价.xlsx`
    //   const workbook = new ExcelJS.Workbook();
    //   await workbook.xlsx.readFile(fileName);
    //   const worksheet = workbook.getWorksheet('Sheet1');
    //   const worksheetData = worksheet.getSheetValues().filter(item=>item.length >2).map(item=>item.slice(1))
    //   const responseData = worksheetData.slice(1).map(item=>({
    //       date: item[0],
    //       huishou: item[1],
    //       data: item[2]
    //   }))
    //    ctx.success(responseData);	
    // }  catch(err){
    //   ctx.error(500,'数据不存在')
    // }
});



module.exports = router;