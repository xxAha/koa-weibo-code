/**
 * @description blog-home controlller
 */

const { creactBlog, getBlogListByFollower } = require('../services/blog')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { createBlogFailInfo } = require('../model/ErrorInfo')
const xss = require('xss')
const { PAGE_SIZE, REG_FOR_AT_WHO } = require('../conf/constant')
const { getUserInfo } = require('../services/user')
const { createAtRelation } = require('../services/at-relation')

/**
 * 创建微博
 * @param {string} userId 用户id
 * @param {string} content 内容
 * @param {string} image 图片路径
 */
async function create({ userId, content, image }) {
  // 分析并收集 content 中的 @ 用户
  // content 格式如 '哈喽 @李四 - lisi 你好 @王五 - wangwu '
  const atUserNameList = []

  content = content.replace(
    REG_FOR_AT_WHO,
    (matchStr, nickName, userName) => {
      // 目的不是 replace 而是获取 userName
      atUserNameList.push(userName)
      return matchStr // 替换不生效，预期
    }
  )

  // 获取 @ 用户列表的信息
  const atUserInfoList = await Promise.all(atUserNameList.map(userName => getUserInfo(userName)))
  // 获取 @ 用户列表的id数组
  const atUserIdList = atUserInfoList.map(user => user.id)

  try {
    const blog = await creactBlog({
      userId,
      content: xss(content),
      image
    })

    // 创建 @ 关系
    await Promise.all(atUserIdList.map(userId => createAtRelation(blog.id, userId)))

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