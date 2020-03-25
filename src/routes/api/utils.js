/**
 * @description utils api 路由
 */

const router = require('koa-router')()
const { loginCheck } = require('../../middlewares/loginChecks')
const koaFrom = require('formidable-upload-koa')

router.prefix('/api/utils')

router.post('/upload', loginCheck, koaFrom(), async (ctx, next) => {
  //获取文件
  //['file'] -> 对应前端formData里append的key
  //前端：
  //var formData = new FormData()
  //formData.append('file', file)
  const file = ctx.req.files['file']
  const { name, path, type, size } = file
  ctx.body = await saveFile({ name, path, type, size })
})

module.exports = router