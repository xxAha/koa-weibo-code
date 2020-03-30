/**
 * @description 用户 @ 关系services
 */

const { AtRelation } = require('../db/model')

/**
 * 创建用户 @ 关系
 * @param {number} blogId 博客 ID
 * @param {string} userId 被 @ 的用户id
 */
async function createAtRelation(blogId, userId) {
  const result = await AtRelation.create({
    blogId,
    userId
  })

  return result.dataValues
}

/**
 * 获取用户的 @ 总数
 * @param {number} userId 用户id
 */
async function getAtRelationCount(userId){
  const result = await AtRelation.findAndCountAll({
    where: {
      userId,
      isRead: false
    }
  })

  return result.count

}

module.exports = {
  createAtRelation,
  getAtRelationCount
}