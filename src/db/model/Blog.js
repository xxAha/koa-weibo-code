/**
 * @description Blog数据模型
 */

const seq = require('../seq')
const { STRING, TEXT, INTEGER } = require('../types')

const Blog = seq.define('blog', {
  userId: {
    type: INTEGER,
    allowNull: false,
    comment: '用户 ID'
  },
  content: {
    type: TEXT,
    allowNull: false,
    comment: '微博内容' 
  },
  image: {
    type: STRING,
    comment: '微博图片地址'
  }
})

module.exports = Blog