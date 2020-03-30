/**
 * @description 用户 @ controller
 */

const { getAtRelationCount, getBlogListByAtRelation, updateAtRelation } = require('../services/at-relation')
const { SuccessModel } = require('../model/ResModel')
const { PAGE_SIZE } = require('../conf/constant')

/**
 * 获取 @ 我的总数
 * @param {number} myId 当前登录用户的id
 */
async function  getAtMeCount(userId) {
  const result = await getAtRelationCount(userId)
  return new SuccessModel({
    count: result
  })
}

/**
 * 获取 @ 我的博客列表
 * @param {object} params 当前登录用户的id
 */
async function  getAtMeBlogList(userId, pageIndex = 0) {
  const result = await getBlogListByAtRelation({
    userId,
    pageIndex,
    pageSize: PAGE_SIZE
  })

  return new SuccessModel({
    isEmpty: result.count === 0,
    blogList: result.blogList,
    pageSize: PAGE_SIZE,
    pageIndex,
    count: result.count
  })
}

/**
 * @ 未读改变为已读
 * @param {number} userId 用户 ID
 */
async function changeAtRelationToRead(userId) {
  try {
    await updateAtRelation(
      { newRead: true },
      { userId, isRead: false }
    )
  } catch (error) {
    console.error(error.messgae, error.stack)
  }
}

module.exports = {
  getAtMeCount,
  getAtMeBlogList,
  changeAtRelationToRead
}