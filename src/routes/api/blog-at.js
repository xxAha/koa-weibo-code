/**
 * @description @ API 路由
 */


const router = require('koa-router')()
const { loginCheck } = require('../../middlewares/loginChecks')
const { getBlogListStr } = require('../../utils/blog')
const { getAtMeBlogList } = require('../../controller/blog-at')

router.prefix('/api/atMe')

//加载更多
router.get('/loadMore/:pageIndex', loginCheck, async (ctx, next) => {
  let { pageIndex } = ctx.params
  const { id: userId } = ctx.session.userInfo
  pageIndex = parseInt(pageIndex)

  const result = await getAtMeBlogList(userId, pageIndex)
  result.data.blogListTpl = getBlogListStr(result.data.blogList)
  ctx.body = result
  
})



module.exports = router