/**
 * @description 用户 @ controller
 */

const { getAtRelationCount } = require('../services/at-relation')
const { SuccessModel } = require('../model/ResModel')

/**
 * 获取 @ 我的总数
 * @param {number} myId 当前登录用户的id
 */
async function  getAtMeCount(myId) {
  const result = await getAtRelationCount(myId)
  return new SuccessModel({
    count: result
  })
}

module.exports = {
  getAtMeCount
}