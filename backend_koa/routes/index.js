const testRouter = require('./test')
const jinjiaRouter = require('./jinjia')

module.exports = function initRouter(app){
     app.use(testRouter.routes())
     app.use(jinjiaRouter.routes())
}