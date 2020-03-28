/**
 * @description blog-profile API 路由
 */

const router = require('koa-router')()
const { loginCheck } = require('../../middlewares/loginChecks')
const { getProfileBlogList } = require('../../controller/blog-profile')
const { getBlogListStr } = require('../../utils/blog')
const { follow, unfollow } = require('../../controller/user-relation')

router.prefix('/api/profile')

//加载更多
router.get('/loadMore/:userName/:pageIndex', loginCheck, async (ctx, next) => {
  let { userName, pageIndex } = ctx.params
  pageIndex = parseInt(pageIndex)
  const result = await getProfileBlogList({ userName, pageIndex })
  result.data.blogListTpl = getBlogListStr(result.data.blogList)
  ctx.body = result
  
})

//关注
router.post('/follow', loginCheck, async (ctx, next) => {
  const { id: myId } = ctx.session.userInfo
  const { userId: curId } = ctx.request.body
  ctx.body = await follow(myId, curId)
})

//关注
router.post('/unFollow', loginCheck, async (ctx, next) => {
  const { id: myId } = ctx.session.userInfo
  const { userId: curId } = ctx.request.body
  ctx.body = await unfollow(myId, curId)
})



module.exports = router