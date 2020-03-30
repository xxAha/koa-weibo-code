/**
 * @description user API 路由
 */

const router = require('koa-router')()
const {
  isExist,
  regiseter,
  login,
  deleteCurUser,
  changeUserInfo,
  changeUserPassword,
  logout
} = require('../../controller/user')
const userValidate = require('../../validator/user')
const {
  genValidator
} = require('../../middlewares/validator')
const {
  isTest
} = require('../../utils/env')
const {
  loginCheck
} = require('../../middlewares/loginChecks')
const { getFollowers } = require('../../controller/user-relation')

router.prefix('/api/user')

//routes层，负责接收参数，返回数据，校验数据
//注册路由
router.post('/register', genValidator(userValidate), async (ctx, next) => {
  //genValidator(userValidate) 校验数据
  //获取数据
  const {
    userName,
    password,
    gender
  } = ctx.request.body
  //返回数据
  ctx.body = await regiseter({
    userName,
    password,
    gender
  })
  //ctx.render() //view
})

//用户名是否存在
router.post('/isExist', async (ctx, next) => {
  const {
    userName
  } = ctx.request.body
  ctx.body = await isExist(userName)
})

//用户登陆
router.post('/login', async (ctx, next) => {
  
  const {
    userName,
    password
  } = ctx.request.body
  ctx.body = await login({
    ctx,
    userName,
    password
  })
})

//用户删除
router.post('/delete', loginCheck, async (ctx, next) => {
  if (isTest) {
    //测试环境才提供删除用户操作，测试账号登录之后，删除自己
    const {
      userName
    } = ctx.session.userInfo
    ctx.body = await deleteCurUser(userName)
  }
})

//修改用户信息
router.patch('/changeInfo', loginCheck, genValidator(userValidate), async (ctx, next) => {
  const {
    nickName,
    picture,
    city
  } = ctx.request.body
  ctx.body = await changeUserInfo(ctx, {
    nickName,
    picture,
    city
  })
})

//修改密码
router.patch('/changePassword', loginCheck, genValidator(userValidate), async (ctx, next) => {
  const {
    password,
    newPassword
  } = ctx.request.body
  const {
    userName
  } = ctx.session.userInfo
  ctx.body = await changeUserPassword({
    userName,
    password,
    newPassword
  })
})

//退出登陆
router.post('/logout', loginCheck, async (ctx, next) => {
  ctx.body = await logout(ctx)
})


//获取at列表
router.get('/getAtList', loginCheck, async (ctx, next) => {
  const { id: userId } = ctx.session.userInfo
  const result = await getFollowers(userId)
  //格式 ['李四 - lisi', '昵称 - 用户名']
  const list = result.data.followList.map(user => {
    return `${user.nickName} - ${user.userName}`
  })
  ctx.body = list

})

module.exports = router