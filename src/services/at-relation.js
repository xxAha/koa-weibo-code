/**
 * @description 用户 @ 关系services
 */

const { AtRelation, Blog, User } = require('../db/model')
const { formatUser, formatBlog } = require('./_format')

/**
 * 创建用户 @ 关系
 * @param {number} blogId 博客 ID
 * @param {string} userId 被 @ 的用户id
 */
async function createAtRelation(blogId, userId) {
  const result = await AtRelation.create({
    blogId,
    userId
  })

  return result.dataValues
}

/**
 * 获取用户的 @ 总数
 * @param {number} userId 用户id
 */
async function getAtRelationCount(userId){
  const result = await AtRelation.findAndCountAll({
    where: {
      userId,
      isRead: false
    }
  })

  return result.count

}

/**
 * 通过 @ 关系获取博客列表
 * @param {object} params 查询条件 { userId, pageIndex, pageSize = 10 }
 */
async function getBlogListByAtRelation({ userId, pageIndex, pageSize = 10 }) {
  const result = await Blog.findAndCountAll({
    limit: pageSize,
    offset: pageSize * pageIndex,
    order: [
      ['id', 'desc']
    ],
    include: [
      {
        model: User,
        attributes: ['id', 'userName', 'nickName', 'picture']
      },
      {
        model: AtRelation,
        where: {
          userId
        }
      }

    ]
  })
  const blogList = result.rows.map(row => {
    const blog =  formatBlog(row.dataValues)
    blog.user = formatUser(row.dataValues.user.dataValues)
    blog.atRelations = row.dataValues.atRelations.map(
      re => re.dataValues
    )
    return blog
  })
  
  return {
    count: result.count,
    blogList
  }
}




module.exports = {
  createAtRelation,
  getAtRelationCount,
  getBlogListByAtRelation
}