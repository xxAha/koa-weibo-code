/**
 * @description blog-profile controller
 */
const { getBlogListByUser } = require('../services/blog')
const { PAGE_SIZE } = require('../conf/constant')
const { SuccessModel, ErrorModel } = require('../model/ResModel')


async function getProfileBlogList({ userName, pageIndex }) {
  try {
    const result = await getBlogListByUser({
      userName,
      pageIndex,
      pageSize: PAGE_SIZE
    })
    
    return new SuccessModel({
      isEmpty: result.count === 0,
      blogList: result.blogList,
      pageSize: PAGE_SIZE,
      pageIndex,
      count: result.count
    })

  } catch (error) {
    console.log(error.message, error.stack)
    return new ErrorModel({
      errno: '9999',
      message: '查询微博失败'
    })
  }


}

module.exports = {
  getProfileBlogList
}