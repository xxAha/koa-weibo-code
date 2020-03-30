/**
 * @description 用户 @ 关系模型 
 */

const seq = require('../seq')
const { INTEGER, BOOLEAN } = require('../types')

const AtRelation = seq.define('atRelation', {
  userId: {
    type: INTEGER,
    allowNull: false,
    comment: '用户 ID'
  },
  blogId: {
    type: INTEGER,
    allowNull: false,
    comment: '博客 ID'
  },
  isRead: {
    type: BOOLEAN,
    allowNull: false,
    defaultValue: false,
    comment: '是否已读'
  }
})

module.exports = AtRelation