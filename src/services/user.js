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

//service层，负责数据库的操作和格式化数据
/**
 * @param {string} userName 用户名
 * @param {string} password 密码
 * @param {number} gender   性别
 * @param {string} nickName 昵称  
 */
async function createUser({ userName, password, gender, nickName }) {
  //这里是操作数据库的，就算前端有些数据没传例如nickName
  //但为了接口的可扩展性，我们还是需要定义接收尽量多的参数(不能为空的参数)
  console.log(arguments);
  const result = await User.create({
    userName,
    password,
    gender: gender ? gender : 3,
    nickName: nickName ? nickName : userName 
  })
  return result.dataValues
}

module.exports = {
  getUserInfo,
  createUser
}