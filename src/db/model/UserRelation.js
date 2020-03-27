/**
 * @description 用户关系模型
 */

const seq = require('../seq')
const { INTEGER } = require('../types')

const UserRelation = seq.define('userRelation', {
  // userId 关注了 followId
  userId: {
    type: INTEGER,
    allowNull: false,
    comment: '用户 ID'
  },
  followerId: {
    type: INTEGER,
    allowNull: false,
    comment: '关注用户的 ID'
  }
})

module.exports = UserRelation
