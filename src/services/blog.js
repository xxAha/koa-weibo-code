/**
 * @description blog services
 */

const {
  Blog
} = require('../db/model/index')

/**
 * 创建微博
 * @param {string} userId 用户id
 * @param {string} content 内容
 * @param {string} image 图片路径
 */
async function creactBlog({
  userId,
  content,
  image
}) {
  const result = await Blog.create({
    userId,
    content,
    image
  })
  return result.dataValues
}

module.exports = {
  creactBlog
}