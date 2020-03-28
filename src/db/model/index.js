/**
 * @description 数据模型入口文件
 */

const User = require('./User')
const Blog = require('./Blog')
const UserRelation = require('./UserRelation')

Blog.belongsTo(User, {
  foreignKey: 'userId'
})
//通过 UserRelation.findAndCountAll include(关联) 查询 User
//只要 UserRelation.followerId 等于 User.id 的user数据都会查询出来
UserRelation.belongsTo(User, {
  foreignKey: 'followerId'
})

//通过 User.findAndCountAll include(关联) 查询 UserRelation
//只要 UserRelation.userId 等于 User.id 的user数据都会查询出来
User.hasMany(UserRelation, {
  foreignKey: 'userId'
})

module.exports = {
  User,
  Blog,
  UserRelation
}