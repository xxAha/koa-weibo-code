/**
 * @description utils api 路由
 */

const router = require('koa-router')()
const { loginCheck } = require('../../middlewares/loginChecks')
const { saveFile } = require('../../controller/utils') 
const koaFrom = require('formidable-upload-koa')

router.prefix('/api/utils')

// 上传图片
router.post('/upload', loginCheck, koaFrom(), async (ctx, next) => {

  //['file'] -> 对应前端formData里append的key
  //前端：
  //var formData = new FormData()
  //formData.append('file', file)
  const file = ctx.req.files['file'] //获取文件
  const { name, path, type, size } = file
  ctx.body = await saveFile({ name, type, size, filePath: path })
})

module.exports = router