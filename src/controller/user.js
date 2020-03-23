/**
 * @description user controller
 */
const {
  getUserInfo,
  createUser
} = require('../services/user')
const {
  SuccessModel,
  ErrorModel
} = require('../model/ResModel')
const {
  registerUserNameNotExistInfo,
  registerUserNameExistInfo,
  registerFailInfo
} = require('../model/ErrorInfo')

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

//controller层，处理业务逻辑，返回格式
/**
 * 用户名注册
 * @param { string } userName 用户名
 */
async function regiseter({
  userName,
  password,
  gender
}) {
  const userInfo = await getUserInfo(userName)
  if (userInfo) {
    //用户名已存在
    return new SuccessModel(registerUserNameExistInfo)
  }

  //注册
  try {
    await createUser({userName, password, gender})
    return new SuccessModel()
  } catch (error) {
    console.error(error.messgae, error.stack)
    return new ErrorModel(registerFailInfo)
  }
}

module.exports = {
  isExist,
  regiseter
}