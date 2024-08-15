const Koa = require('koa');
const app = new Koa();

const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const cors = require('koa2-cors'); // 跨域中间件
const json = require('koa-json');
const errorHandler = require('./middleware/errorHandler')
const response = require('./middleware/response')
const validate = require('./middleware/validate')
const initRouter = require('./routes')


// error handler
onerror(app);


// 处理post 请求body参数
app.use(bodyparser({
     enableTypes: ['json', 'form', 'text']
}))


app.use(
  cors({
    // origin: function (ctx) {
    //   if (ctx.url === '/test') {
    //     return '*'; // 允许来自所有域名请求
    //   }
    //   return 'http://localhost:3999'; // 这样就能只允许 http://localhost:8080 这个域名的请求了
    // },
    exposeHeaders: ['Authorization']
    // maxAge: 3600,
    // credentials: true,
    // allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
    // allowHeaders: ['refresh_token', 'token']
  })
); // 设置允许跨域访问该服务.


app.use(errorHandler); // 统一错误异常处理
app.use(validate); // 验证
app.use(response); // 返回体中间件,添加统一返回方法

app.use(json())



// 注册路由
initRouter(app)



module.exports = app