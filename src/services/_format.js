/**
 * @description 数据格式化
 */
const { DEFAULT_PICTURE } = require('../conf/constant')

/**
 * 用户默认头像
 * @param { object } obj 用户对象
 */
function _formatUserPicture(obj) {
  if(obj.picture == null) {
    obj.picture = DEFAULT_PICTURE
  }
  return obj
}


/**
 * 格式话用户信息
 * @param { Array|Object } list 用户列表，可以是一个数据，也可以是一个对象
 */
function formatUser(list) {
  if(list == null) {
    return list
  }

  //如果是数组
  if(list instanceof Array) {
    return list.map(_formatUserPicture)
  }

  //如果是单个对象
  return _formatUserPicture(list)
}

module.exports = {
  formatUser
}