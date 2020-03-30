/**
 * @description 数据模型入口文件
 */

const User = require('./User')
const Blog = require('./Blog')
const UserRelation = require('./UserRelation')
const AtRelation = require('./AtRelation')

//通过 UserRelation.findAndCountAll include(关联) 查询 User
//只要 UserRelation.followerId 等于 User.id 的user数据都会查询出来
UserRelation.belongsTo(User, {
  foreignKey: 'followerId' //UserRelation 的followerId
})

//通过 User.findAndCountAll include(关联) 查询 UserRelation
//只要 UserRelation.userId 等于 User.id 的user数据都会查询出来
User.hasMany(UserRelation, {
  foreignKey: 'userId' //UserRelation 的 userId
})

Blog.belongsTo(User, {
  foreignKey: 'userId'
})
// 因为上面已经用 Blog.userId 关联了 User表，
// 这里再用 Blog.userId 关联 UserRelation.followerId 在数据库查看是没有操作成功
// 但不影响 Blog.findAndCountAll 的时候 include 查询 UserRelation
// 外键默认关联主键，如果想指定关联某个键，可以使用targetKey:
// Blog 的 userId 关联 UserRelation 的 followerId 
Blog.belongsTo(UserRelation, {
  foreignKey: 'userId',  // Blog 的 userId
  targetKey: 'followerId' //UserRelation 的 followerId
})

Blog.hasMany(AtRelation, {
  foreignKey: 'blogId'
})

module.exports = {
  User,
  Blog,
  UserRelation,
  AtRelation
}

