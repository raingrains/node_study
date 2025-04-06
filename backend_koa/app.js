const Koa = require('koa');
const app = new Koa();
const path = require('path')

const onerror = require('koa-onerror');
const bodyparser = require('koa-bodyparser');
const cors = require('koa2-cors'); // 跨域中间件
const json = require('koa-json');
const errorHandler = require('./middleware/errorHandler')
const response = require('./middleware/response')
const validate = require('./middleware/validate')
const initRouter = require('./routes')
// 引入 koa-static
  const staticFiles = require('koa-static')

// error handler
onerror(app);


// 处理post 请求body参数
app.use(bodyparser({
     enableTypes: ['json', 'form', 'text']
}))

app.use(
  cors({
    origin: '*', // 指定允许的域名
    exposeHeaders: ['Authorization'],
    maxAge: 3600,
    credentials: false, // 允许携带凭据
    allowMethods: ['GET', 'POST', 'DELETE', 'PUT'],
    allowHeaders: ['Content-Type', 'Authorization', 'refresh_token', 'token']
  })
); // 设置允许跨域访问该服务.


app.use(errorHandler); // 统一错误异常处理
app.use(validate); // 验证
app.use(response); // 返回体中间件,添加统一返回方法

app.use(json())



// 注册路由
initRouter(app)
 // 指定 public目录为静态资源目录，用来存放 js css images 等
  app.use(staticFiles(path.resolve(__dirname, "./public")))




module.exports = app