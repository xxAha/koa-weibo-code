/**
 * @description user API 路由
 */

const router = require('koa-router')()
const { isExist, regiseter } = require('../../controller/user')

router.prefix('/api/user')

//routes层，负责接收参数，返回数据，校验数据
//注册路由
router.post('/register', async (ctx, next) => {
  const { userName, password, gender } = ctx.request.body
  ctx.body = await regiseter({ userName, password, gender })
})

//用户名是否存在
router.post('/isExist', async (ctx, next) => {
  const { userName } = ctx.request.body
  ctx.body = await isExist(userName)
})

module.exports = router