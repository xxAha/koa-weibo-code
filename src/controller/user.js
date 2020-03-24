/**
 * @description user controller
 */
const {
  getUserInfo,
  createUser,
  deleteUser
} = require('../services/user')
const {
  SuccessModel,
  ErrorModel
} = require('../model/ResModel')
const {
  registerUserNameNotExistInfo,
  registerUserNameExistInfo,
  registerFailInfo,
  loginFailInfo,
  deleteUserFailInfo
} = require('../model/ErrorInfo')
const doCrypto = require('../utils/cryp')

//controller层，处理业务逻辑，设置返回格式
/**
 * 用户名注册
 * @param { string } userName 用户名
 */
async function regiseter({ userName, password, gender }) {
  const userInfo = await getUserInfo(userName)
  //业务逻辑
  if (userInfo) {
    // 用户名已存在
    return new ErrorModel(registerUserNameExistInfo)
  }

  //注册
  try {
    await createUser({
      userName,
      password: doCrypto(password),
      gender
    })
    //设置返回格式
    return new SuccessModel()
  } catch (error) {
    console.error(error.messgae, error.stack)
    return new ErrorModel(registerFailInfo)
  }
}

/**
 * 用户名是否存在
 * @param { string } userName 用户名
 */
async function isExist(userName) {
  const userInfo = await getUserInfo(userName)
  if (userInfo) {
    //用户名已存在
    return new SuccessModel(userInfo)
  } else {
    //用户名未存在
    return new ErrorModel(registerUserNameNotExistInfo)
  }
}

/**
 * 用户登陆
 * @param {object} ctx 执行上下问
 * @param {string} userName 用户名
 * @param {string} password 密码
 */
async function login({ctx, userName, password}) { 
  const userInfo = await getUserInfo(userName, doCrypto(password))
  //如果用户名/密码不正确 userInfo是null
  if(userInfo == null) {
    return new ErrorModel(loginFailInfo)
  }
  //登陆成功
  if(ctx.session.userInfo == null) {
    ctx.session.userInfo = userInfo
  }
  return new SuccessModel()

}

/**
 * 删除用户
 * @param {string} userName 用户名
 */
async function deleteCurUser(userName) {
  const result = await deleteUser(userName)
  if(result) {
    return new SuccessModel()
  }
  return new ErrorModel(deleteUserFailInfo)
} 

module.exports = {
  isExist,
  regiseter,
  login,
  deleteCurUser
}