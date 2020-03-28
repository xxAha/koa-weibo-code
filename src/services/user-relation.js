/**
 * @description 用户关系 services
 */


const { User, UserRelation } = require('../db/model')
const { formatUser } = require('./_format')
const Sequelize = require('sequelize')

/**
 * 获取关注该用户的用户列表，即该用户的粉丝
 * @param {number} userId 被关注的用户id
 */
async function getUsersByFollowerId(followerId) {
  const result = await User.findAndCountAll({
    attributes: ['id', 'userName', 'nickName', 'picture'],
    order: [
      ['id', 'desc']
    ],
    include: [
      {
        model: UserRelation,
        where: {
          //查询followerId = userId 的用户 -> 就是关注了 userId 的用户
          followerId
        }
      }
    ]
  })

  const userList = result.rows.map(row => {
    const userValue = formatUser(row.dataValues)
    // userValue.userRelations = row.dataValues.userRelations.map(u => {
    //   return u.dataValues
    // })
    return userValue
  })
  //console.log(userList);
  return {
    userList,
    count: result.count
  }

}

/**
 * 创建用户关系
 * @param {number} userId 关注人的id
 * @param {number} followerId 被关注人的id
 */
async function createUserRelation(userId, followerId) {
  const result = await UserRelation.create({
    userId,
    followerId
  })
  return result.dataValues
}

/**
 * 取消用户关系
 * @param {number} userId 关注人的id
 * @param {number} followerId 被取消关注人的id
 */
async function destroyUserRelation(userId, followerId) {
  const result = await UserRelation.destroy({
    where: {
      userId,
      followerId
    }
  })

  return result > 0
}


module.exports = {
  getUsersByFollowerId,
  createUserRelation,
  destroyUserRelation
}