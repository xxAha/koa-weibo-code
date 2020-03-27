/**
 * @description 用户关系 controller
 */

const { getUsersByFollowerId } = require('../services/user-relation')
const { SuccessModel } = require('../model/ResModel')

/**
 * 查询用户的粉丝
 * @param {number} userId 查询的用户ID
 */
async function getFans(userId) {
  const result = await getUsersByFollowerId(userId)
  return new SuccessModel({
    fansCount: result.count,
    fansList: result.userList
  })
}

module.exports = {
  getFans
}