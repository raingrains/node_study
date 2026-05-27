const promisePool = require('../utils/database');
const router = require('koa-router')();

router.prefix('/data'); // 设置路由前缀

// 新增金价记录
router.post('/jinjia_adds', async (ctx, next) => {
  // 参数为数组形式 [{ date: '2024-08-01 00:00:01', huishou: 500, data: 1000 }, ...]

  const { data } = typeof ctx.request.body === 'string' ? JSON.parse(ctx.request.body) : ctx.request.body;

  // 检查参数格式是否为非空数组
  if (!Array.isArray(data) || data.length === 0) {
    ctx.error(400, '参数格式错误');
    return;
  }

  // 检查每个对象的格式
  for (const item of data) {
    if (!item.date || !item.huishou || !item.data) {
      ctx.error(400, JSON.stringify(item)+'参数格式错误');
      return;
    }

    // 检查日期格式是否符合 YYYY-MM-DD HH:mm:ss
    const datePattern = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/;
    if (!datePattern.test(item.date)) {
      ctx.error(400, '日期格式错误');
      return;
    }
  }

  // 使用 SQL 语句批量插入数据
  const sql = 'INSERT INTO jinjia (date, huishou, data) VALUES ?';
  const values = data.map(item => [item.date, item.huishou, item.data]);
  console.log(values);

  try {
    // 执行数据库插入操作
    const [result] = await promisePool.query(sql, [values]);
    if (data.length > 1) {
      ctx.success({
        successful: true, // 返回批量插入成功标志
      });
    } else {
      ctx.success({
        id: result.insertId, // 返回单条插入的记录 ID
      });
    }
  } catch (err) {
    console.error('Database insert failed:', err);
    ctx.error(500, '记录新增失败'); // 返回数据库插入失败错误
  }
});

// 查询金价记录
router.get('/jinjia', async (ctx, next) => {
  // 初始化默认时间范围
  const defaultTimes = ['2024-08-15', '2024-08-31'];
  const times = ctx.request.query.time ? ctx.request.query.time.split('/') : defaultTimes;
  console.log(times);

  let step = 1; // 设置步长，默认为 1

  // 计算两个日期之间的天数差
  const startDate = new Date(times[0]);
  const endDate = new Date(times[1]);
  const timeDiff = Math.abs(endDate - startDate);
  const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // 转换为天数

  // 根据天数差动态设置步长，规则：天数差除以 30 的值向上取整
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

    // 执行查询，按步长筛选数据
    const [rows] = await promisePool.query(query, [times[0] + ' 00:00:00', times[1] + ' 23:59:59', step]);
    // 返回查询结果
    ctx.success({
      data: rows,
      step, // 返回步长信息
    });
  } catch (err) {
    console.error('Database query failed:', err);
    ctx.error(500, '数据查询失败'); // 返回查询失败错误
  }
});

module.exports = router; // 导出路由模块