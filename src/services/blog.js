/**
 * @description blog services
 */

const { Blog, User } = require('../db/model/index')
const { formatUser } = require('../services/_format')
const { formatBlog } = require('./_format')

/**
 * 创建微博
 * @param {string} userId 用户id
 * @param {string} content 内容
 * @param {string} image 图片路径
 */
async function creactBlog({ userId, content, image }) {
  const result = await Blog.create({
    userId,
    content,
    image
  })
  return result.dataValues
}

/**
 * 查询博客数据
 * @param {string} userName 用户名
 * @param {number} pageIndex 当前页码
 * @param {number} pageSize 一页显示多少条
 */
async function getBlogListByUser({ userName, pageIndex = 0, pageSize = 10 }) {

  //拼接查询条件
  const userWhereOpt = {}
  if (userName) {
    userWhereOpt.userName = userName
  }

  const result = await Blog.findAndCountAll({
    limit: pageSize,
    offset: pageIndex * pageSize,
    order: [
      ['id', 'desc']
    ],
    include: [{
      model: User,
      attributes: ['userName', 'nickName', 'picture'],
      where: userWhereOpt
    }]
  })

  let blogList = result.rows.map(row => row.dataValues)
  blogList = blogList.map(blog => {
    const user = blog.user.dataValues
    blog.user = formatUser(user)
    return blog
  })
  blogList = formatBlog(blogList)

  return {
    count: result.count,
    blogList
  }

}

module.exports = {
  creactBlog,
  getBlogListByUser
}