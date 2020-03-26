/**
 * @description blog view 路由
 */

const router = require('koa-router')()
const { loginRedirect } = require('../../middlewares/loginChecks')
const { getProfileBlogList } = require('../../controller/blog-profile')
const { isExist } = require('../../controller/user')

//主页
router.get('/', loginRedirect, async (ctx, next) => {
  await ctx.render('index')
})

//个人主页
router.get('/profile', loginRedirect, async (ctx, next) => {
  const { userName } = ctx.session.userInfo
  ctx.redirect(`/profile/${userName}`)
})
router.get('/profile/:userName', loginRedirect, async (ctx, next) => {

  const myUserInfo = ctx.session.userInfo
  const myUserName = myUserInfo.userName
  const { userName: curUserName } = ctx.params
  const isMe = myUserName === curUserName
  let curUserInfo

  if (isMe) {
    //是当前登录用户
    curUserInfo = myUserInfo
  } else {
    //不是当前登录用户
    const existResult = await isExist(curUserName)
    if (existResult.errno !== 0) {
      //用户不存在
      return await next()
    }
    curUserInfo = existResult.data
  }

  //获取第一页的微博数据
  const result = await getProfileBlogList({ userName: curUserName, pageIndex: 0 })
  await ctx.render('profile', {
    blogData: result.data,
    userData: {
      userInfo: curUserInfo,
      isMe
    }
  })
})

module.exports = router