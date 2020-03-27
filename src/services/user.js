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
 * 创建用户
 * @param {string} userName 用户名
 * @param {string} password 密码
 * @param {number} gender   性别
 * @param {string} nickName 昵称  
 */
async function createUser({ userName, password, gender, nickName }) {
  //这里是操作数据库的，就算前端有些数据没传例如nickName
  //但为了接口的可扩展性，我们还是需要定义接收尽量多的参数(不能为空的参数)
  const result = await User.create({
    userName,
    password,
    gender: gender ? gender : 3,
    nickName: nickName ? nickName : userName 
  })
  return result.dataValues
}

/**
 * 删除用户
 * @param {string} userName 用户名
 */
async function deleteUser(userName) {
  const result = await User.destroy({
    where: {
      userName
    }
  })
  // result 删除的行数
  return result > 0
}

/**
 * 更新用户
 * @param {string} userName 用户名
 */
async function updateUser(
  //接收修改内容对象
  { newNickName, newPicture, newCity, newPassword },
  //接收查询条件对象
  { userName, password },
) {

  //拼接修改内容
  const updateData = {}
  if(newNickName) {
    updateData.nickName = newNickName
  }
  if(newPicture) {
    updateData.picture = newPicture
  }
  if(newCity) {
    updateData.city = newCity
  }
  if(newPassword) {
    updateData.password = newPassword
  }

  //拼接查询条件
  const whereData = {
    userName
  }
  if(password) {
    whereData.password = password
  }

  //执行
  const result = await User.update(updateData, {
    where: whereData
  })

  return result[0] > 0

}

module.exports = {
  getUserInfo,
  createUser,
  deleteUser,
  updateUser
}