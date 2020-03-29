/**
 * @description blog-home controlller
 */

const { creactBlog, getBlogListByFollower } = require('../services/blog')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { createBlogFailInfo } = require('../model/ErrorInfo')
const xss = require('xss')
const { PAGE_SIZE } = require('../conf/constant')

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

/**
 * 查询首页博客列表
 * @param {number} userId 查询此用户的关注人博客列表
 * @param {number} pageIndex 页码
 */
async function getHomeBlogList(userId, pageIndex = 0) {
  //services
  const result = await getBlogListByFollower({userId, pageIndex, pageSize: PAGE_SIZE})
  return new SuccessModel({
    isEmpty: result.count === 0,
    blogList: result.blogList,
    pageSize: PAGE_SIZE,
    pageIndex,
    count: result.count
  })
}

module.exports = {
  create,
  getHomeBlogList
}