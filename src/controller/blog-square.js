/**
 * @description square controller 路由
 */
const { PAGE_SIZE } = require('../conf/constant')
const { getSquareCacheBlogList } = require('../cache/blog')
const { SuccessModel } = require('../model/ResModel')

/**
 * 获取广场页微博
 * @param {number} pageIndex 页码
 */
async function getSquareBlogList(pageIndex = 0) {
  const result = await getSquareCacheBlogList(pageIndex, PAGE_SIZE)
  return new SuccessModel({
    isEmpty: result.count === 0,
    blogList: result.blogList,
    count: result.count,
    pageIndex,
    pageSize: PAGE_SIZE
  })
  

}

module.exports = {
  getSquareBlogList
}