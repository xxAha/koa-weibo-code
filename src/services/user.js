/**
 * @description user service
 */

const { User } = require('../db/model')
const { formatUser } = require('./_format')

/**
 * 获取用户新
 * @param { string } userName 用户名
 * @param { string } password 密码
 */
async function getUserInfo(userName, password) {
  const whereOpt = {
    userName
  }
  
  if(password) {
    Object.assign(whereOpt, { password })
  }

  const result = await User.findOne({
    //要查询的列
    attributes: ['id', 'userName', 'nickName', 'picture', 'city'],
    where: whereOpt
  })

  if (result == null) {
    return result
  }

  //数据格式化
  const formatRes = formatUser(result.dataValues)
  return formatRes

}

module.exports = {
  getUserInfo
}