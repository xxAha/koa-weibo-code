/**
 * @description user controller
 */
const { getUserInfo, createUser, deleteUser, updateUser } = require('../services/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { createUserRelation } = require('../services/user-relation')
const {
  registerUserNameNotExistInfo,
  registerUserNameExistInfo,
  registerFailInfo,
  loginFailInfo,
  deleteUserFailInfo,
  changeInfoFailInfo,
  changePasswordFailInfo
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
    const data = await createUser({
      userName,
      password: doCrypto(password),
      gender
    })
    //自己关注自己，首页获取数据就只需要查询关注列表的博客就可以
    await createUserRelation(data.id, data.id)
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
async function login({
  ctx,
  userName,
  password
}) {
  const userInfo = await getUserInfo(userName, doCrypto(password))
  //如果用户名/密码不正确 userInfo是null
  if (userInfo == null) {
    return new ErrorModel(loginFailInfo)
  }
  //登陆成功
  if (ctx.session.userInfo == null) {
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
  if (result) {
    return new SuccessModel()
  }
  return new ErrorModel(deleteUserFailInfo)
}

/**
 * 修改用户信息
 * @param {object} ctx 执行上下文
 * @param {string} userName 名字
 * @param {string} nickName 昵称
 * @param {string} city 城市
 * @param {string} picture 图片路径
 */
async function changeUserInfo(ctx, {
  nickName,
  city,
  picture
}) {
  const { userName } = ctx.session.userInfo
  //修改内容对象
  const newData = {
    newNickName: nickName,
    newCity: city,
    newPicture: picture
  }
  //查询条件对象
  const where = {
    userName
  }


  try {
    const result = await updateUser(newData, where)
    if (result) {
      //执行成功
      Object.assign(ctx.session.userInfo, {
        nickName,
        city,
        picture
      })
      //返回
      return new SuccessModel()
    }
    //失败
    return new ErrorModel(changeInfoFailInfo)

  } catch (error) {

    return new ErrorModel(changeInfoFailInfo)
  }

}

/**
 * 修改用户密码
 * @param {string} userName 用户名
 * @param {string} password 旧密码
 * @param {string} newPassword 新密码
 */
async function changeUserPassword({ userName, password, newPassword }) {
  const result = await updateUser({ newPassword: doCrypto(newPassword) }, {
    userName,
    password: doCrypto(password)
  })

  if (result) {
    return new SuccessModel()
  }

  return new ErrorModel(changePasswordFailInfo)

}

/**
 * 退出登录
 * @param {object} ctx 执行上下文
 */
async function logout(ctx) {
  delete ctx.session.userInfo
  return new SuccessModel()
}

module.exports = {
  isExist,
  regiseter,
  login,
  deleteCurUser,
  changeUserInfo,
  changeUserPassword,
  logout
}