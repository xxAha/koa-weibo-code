const router = require('koa-router')()

router.get('/', async (ctx, next) => {

  //第一个参数是渲染那个页面，view/index.ejs
  //第二个参数是传入的变量
  //读取模版是一个异步操作所以要用await
  await ctx.render('login')
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

// router.get('/register', async (ctx, next) => {
//   await ctx.render('register')
// })

module.exports = router
