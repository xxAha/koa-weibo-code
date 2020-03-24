/**
 * @description user API 路由
 */

const router = require('koa-router')()
const { isExist, regiseter, login } = require('../../controller/user')
const userValidate = require('../../validator/user')
const { genValidator } = require('../../middlewares/validator')

router.prefix('/api/user')

//routes层，负责接收参数，返回数据，校验数据
//注册路由
router.post('/register', genValidator(userValidate), async (ctx, next) => {
  //genValidator(userValidate) 校验数据
  //获取数据
  const { userName, password, gender } = ctx.request.body 
  //返回数据
  ctx.body = await regiseter({ userName, password, gender })
  //ctx.render() //view
})

//用户名是否存在
router.post('/isExist', async (ctx, next) => {
  const { userName } = ctx.request.body
  ctx.body = await isExist(userName)
})

//用户登陆
router.post('/login', async (ctx, next) => {
  const { userName, password } = ctx.request.body
  ctx.body = await login({ctx, userName, password})


})

module.exports = router