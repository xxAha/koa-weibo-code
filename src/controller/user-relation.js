/**
 * @description 用户关系 controller
 */

const { getUsersByFollowerId } = require('../services/user-relation')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { addFollowerFailInfo, deleteFollowerFailInfo } = require('../model/ErrorInfo')
const { createUserRelation, destroyUserRelation } = require('../services/user-relation')

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

/**
 * 关注
 * @param {number} myId 当前登录的用户id
 * @param {number} curId 被关注的用户id
 */
async function follow(myId, curId) {
  try {
    await createUserRelation(myId, curId)
    return new SuccessModel()
  } catch (error) {
    console.error(error.message, error.stack)
    return new ErrorModel(addFollowerFailInfo)
  }

}

/**
 * 取消关注
 * @param {number} myId 当前登录的用户id
 * @param {number} curId 被取消关注的用户id
 */
async function unfollow(myId, curId) {
  try {
    const result = await destroyUserRelation(myId, curId)
    if(result) {
      return new SuccessModel()
    }

    return new ErrorModel(deleteFollowerFailInfo)

  } catch (error) {
    console.error(error.message, error.stack)
    return new ErrorModel(deleteFollowerFailInfo)
  }

}

module.exports = {
  getFans,
  follow,
  unfollow
}