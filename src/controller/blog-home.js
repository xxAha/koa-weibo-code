/**
 * @description blog-home controlller
 */

const { creactBlog } = require('../services/blog')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { createBlogFailInfo } = require('../model/ErrorInfo')
const xss = require('xss')

/**
 * 创建微博
 * @param {string} userId 用户id
 * @param {string} content 内容
 * @param {string} image 图片路径
 */
async function create({ userId, content, image }) {
  try {
    const blog = await creactBlog({
      userId,
      content: xss(content),
      image
    })
    return new SuccessModel(blog)
  } catch (error) {
    console.error(error.message, error.stack)
    return new ErrorModel(createBlogFailInfo)
  }

}

module.exports = {
  create
}