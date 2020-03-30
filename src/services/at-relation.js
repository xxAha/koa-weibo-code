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

module.exports = {
  createAtRelation
}