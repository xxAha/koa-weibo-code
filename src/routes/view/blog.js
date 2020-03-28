/**
 * @description blog view 路由
 */

const router = require('koa-router')()
const { loginRedirect } = require('../../middlewares/loginChecks')
const { getProfileBlogList } = require('../../controller/blog-profile')
const { getSquareBlogList } = require('../../controller/blog-square')
const { isExist } = require('../../controller/user')
const { getFans } = require('../../controller/user-relation')

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

  //获取粉丝数据
  const fansResult = await getFans(curUserInfo.id)
  const fansData = fansResult.data

  //我是否关注了此人
  const amIFollowed = fansData.fansList.some(item => {
    return item.userName === myUserName
  })
 
  //获取第一页的微博数据
  const result = await getProfileBlogList({ userName: curUserName, pageIndex: 0 })
  await ctx.render('profile', {
    blogData: result.data,
    userData: {
      userInfo: curUserInfo,
      isMe,
      fansData: {
        count: fansData.fansCount,
        list: fansData.fansList
      },
      amIFollowed
    }
  })
})

//广场页
router.get('/square', loginRedirect, async (ctx, next) => {
  const result = await getSquareBlogList(0)
  await ctx.render('square', {
    blogData: result.data
  })

})

module.exports = router