/**
 * @description 数据模型入口文件
 */

const User = require('./User')
const Blog = require('./Blog')
const UserRelation = require('./UserRelation')

Blog.belongsTo(User, {
  foreignKey: 'userId'
})

UserRelation.belongsTo(User, {
  foreignKey: 'userId'
})
//因为 UserRelation 有两个外键（userId & followerId）关联User，
//belongsTo关联一个，hasMany关联一个
User.hasMany(UserRelation, {
  foreignKey: 'followerId'
})

module.exports = {
  User,
  Blog
}