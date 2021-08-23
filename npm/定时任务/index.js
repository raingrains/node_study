const schedule = require('node-schedule')

/**
 *  Cron 风格的定时器： * ： 表示任意
 *  参数讲解 ： *(秒) *(分) *(时) *(日) *(月) *(周)
 *    1. 每分钟的第30秒触发： 30 * * * * *
 *    2. 每小时的1分30秒触发： 30 1 * * * *
 *    3. 每天的1点03分30秒触发： 30 3 1 * * *
 *    4. 2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'
 *    5. 每周一的1点1分30秒触发 ： 30 1 1 * * 1
 */
function cron1(){
  schedule.scheduleJob('30 * * * * *',()=>{
    console.log(1111);
  })
}
// 参数传入数值范围  ： //每分钟的1-10秒都会触发，其它通配符依次类推
let cron2 = ()=>{
  schedule.scheduleJob('1-10 * * * * *',()=>{
    console.log(1111);
  })
}
/**
 *  对象文本语法定时器
 */
function objText(){
  /**
   *  dayOfWeek: 周 
   *  month: 月
   *  dayOfMonth: 日
   *  hour: 时
   *  minute : 分
   *  second ： 秒
   */
  // 每周一的下午16：11分触发，其他组合可以根据代码注释的参数名自由组合
  schedule.scheduleJob({hour: 16, minute: 11, dayOfWeek: 1},()=>{
    console.log(111);
  })
}

/**
 * 取消定时器
 */
function cancelSchedule(){
  let counter = 1
  const  j =  schedule.scheduleJob('* * * * * *',()=>{
    console.log('定时器触发的次数：' + counter);
    counter++ 
    if(counter>5){
      // 定时器取消
      console.log('定时任务取消');
      j.cancel()
    }
  })

}

cancelSchedule()