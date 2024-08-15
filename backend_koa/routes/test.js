const router = require('koa-router')();

router.prefix('/test')

router.post('/hello',async (ctx,next)=>{


     ctx.success('接口调用成功');
})


module.exports = router