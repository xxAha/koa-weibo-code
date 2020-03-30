/**
 * @description blog view 路由
 */

const router = require('koa-router')()
const { loginRedirect } = require('../../middlewares/loginChecks')
const { getProfileBlogList } = require('../../controller/blog-profile')
const { getSquareBlogList } = require('../../controller/blog-square')
const { isExist } = require('../../controller/user')
const { getFans, getFollowers } = require('../../controller/user-relation')
const { getHomeBlogList } = require('../../controller/blog-home')
const { getAtMeCount, getAtMeBlogList } = require('../../controller/blog-at')

//主页
router.get('/', loginRedirect, async (ctx, next) => {
  const userInfo = ctx.session.userInfo
  //获取粉丝数据
  const fansResult = await getFans(userInfo.id)
  const fansData = fansResult.data

  //获取关注列表数据
  const followResult = await getFollowers(userInfo.id)
  const followData = followResult.data

  //获取@数
  const atCountRes = await getAtMeCount(userInfo.id)
  const { count: atCount } = atCountRes.data

  //获取第一页的微博数据
  const result = await getHomeBlogList(userInfo.id)
  await ctx.render('index', {
    blogData: result.data,
    userData: {
      userInfo,
      isMe: true,
      fansData: {
        count: fansData.fansCount,
        list: fansData.fansList
      },
      followersData: {
        count: followData.followCount,
        list: followData.followList
      },
      amIFollowed: false,
      atCount
    }
  })

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

  //获取关注列表数据
  const followResult = await getFollowers(curUserInfo.id)
  const followData = followResult.data

  //我是否关注了此人
  const amIFollowed = fansData.fansList.some(item => {
    return item.userName === myUserName
  })

  //获取@数
  const atCountRes = await getAtMeCount(curUserInfo.id)
  const { count: atCount } = atCountRes.data

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
      followersData: {
        count: followData.followCount,
        list: followData.followList
      },
      amIFollowed,
      atCount
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

//at 页面
router.get('/at-me', loginRedirect, async (ctx, next) => {
  const { id: userId } = ctx.session.userInfo
  //获取@数
  const atCountRes = await getAtMeCount(userId)
  const { count: atCount } = atCountRes.data

  //获取@博客列表
  const result = await getAtMeBlogList(userId)

  await ctx.render('atMe', {
    atCount,
    blogData: result.data
  })

})

module.exports = router