const router = require('koa-router')()

//错误路由
router.get('/error', async (ctx, next) => {
  await ctx.render('error')
})

//404路由
router.get('*', async (ctx, next) => {
  await ctx.render('404')
})

module.exports = router