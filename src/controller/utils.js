/**
 * @description utils controller
 */

const fse = require('fs-extra')
const { ErrorModel, SuccessModel } = require('../model/ResModel')
const { uploadFileSizeFailInfo } = require('../model/ErrorInfo')


//文件最大  1m
const MAX_SIZE = 1024 * 1024 * 1024

/**
 * 保存图片
 * @param {string} name 文件名字
 * @param {string} path 文件路径
 * @param {string} type 文件类型
 * @param {string} size 文件大小
 */
async function saveFile({ name, path, type, size }) {
  if(size > MAX_SIZE) {
    //删除是异步 await
    await fse.remove(path)
    return new ErrorModel(uploadFileSizeFailInfo)
  }
  
}