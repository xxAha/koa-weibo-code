/**
 * @description utils controller
 */

const fse = require('fs-extra')
const {
  ErrorModel,
  SuccessModel
} = require('../model/ResModel')
const {
  uploadFileSizeFailInfo
} = require('../model/ErrorInfo')
const path = require('path')


//文件最大  1m
const MAX_SIZE = 1024 * 1024 * 1024
//存储目录
const DIST_FOLDER_PATH = path.join(__dirname, '..', '..', 'uploadFiles')


// 是否需要创建目录
fse.pathExists(DIST_FOLDER_PATH).then(exist => {
  if (!exist) {
    //如果目录没有uploadFiles文件夹就创建文件夹
    fse.ensureDir(DIST_FOLDER_PATH)
  }
})

/**
 * 保存图片
 * @param {string} name 文件名字
 * @param {string} filePath 文件路径
 * @param {string} type 文件类型
 * @param {string} size 文件大小
 */
async function saveFile({
  name,
  filePath,
  type,
  size
}) {
  if (size > MAX_SIZE) {
    //删除是异步 await
    await fse.remove(filePath)
    return new ErrorModel(uploadFileSizeFailInfo)
  }
  //移动文件(正式上线，这里就不需要移动文件，可能就是直接调用文件服务的api)
  //路由执行了koaFrom() 文件已经保存到了服务器里，
  //如果以mac本地是保存在了 /var/folders/jh/4pfgznbd633cdxmvljv1410c0000gn/T/
  const fileName = Date.now() + '.' + name // 防止重名
  const distFilePath = path.join(DIST_FOLDER_PATH, fileName) // 目的地(还能把文件名字改了。。。)
  //第一个参数是原来的路径
  //第二个参数是移动到哪里
  await fse.move(filePath, distFilePath)

  // 返回信息
  return new SuccessModel({
    url: '/' + fileName
  })
}

module.exports = {
  saveFile
}