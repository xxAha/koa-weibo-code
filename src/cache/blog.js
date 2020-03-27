/**
 *  @description 微博缓cache存层
 */

const { get, set } = require('./_redis')
//没缓存的时候需要到 services 层查询数据库
const { getBlogListByUser } = require('../services/blog')

//redis key 前缀
const KEY_PREFIX = 'weibo:square:'

/**
 * 获取广场页的缓存博客
 * @param {number} pageIndex
 * @param {number} pageSize
 */
async function getSquareCacheBlogList(pageIndex, pageSize) {
  const key = `${KEY_PREFIX}_${pageIndex}_${pageSize}`

  // 尝试获取缓存
  const cacheResult = await get(key)
  if (cacheResult !== null) {
    // 获取缓存成功
    return cacheResult
  }
  
  // 没有缓存/缓存过期，则读取数据库
  const result = await getBlogListByUser({pageIndex, pageSize})
  //第一个参数key，第二个值，第三个过期时间(秒)
  // 设置缓存，过期时间 1min
  set(key, result, 60)
  return result

}

module.exports = {
  getSquareCacheBlogList
}