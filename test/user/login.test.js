/**
 * @description user api test
 * @author 双越老师
 */

const server = require('../server')

// 用户信息
const userName = `u_test_name`
const password = `p_test_password`
const testUser = {
  userName,
  password,
  nickName: userName,
  gender: 1
}

// 存储 cookie
let COOKIE = ''

// 注册
test('注册一个用户，应该成功', async () => {
  const res = await server
    .post('/api/user/register')
    .send(testUser)
  expect(res.body.errno).toBe(0)
})

// 重复注册
test('重复注册用户，应该失败', async () => {
  const res = await server
    .post('/api/user/register')
    .send(testUser)
  expect(res.body.errno).not.toBe(0)
})

// 查询用户是否存在
test('查询注册的用户名，应该存在', async () => {
  const res = await server
    .post('/api/user/isExist')
    .send({
      userName
    })
  expect(res.body.errno).toBe(0)
})

// json schema 检测
test('json schema 检测，非法的格式，注册应该失败', async () => {
  const res = await server
    .post('/api/user/register')
    .send({
      userName: '123', // 用户名不是字母（或下划线）开头
      password: 'a', // 最小长度不是 3
      // nickName: ''
      gender: 'mail' // 不是数字
    })
  expect(res.body.errno).not.toBe(0)
})

// 登录
test('登录，应该成功', async () => {
  const res = await server
    .post('/api/user/login')
    .send({
      userName,
      password
    })
  console.log(res.body);
  expect(res.body.errno).toBe(0)

  // 获取 cookie  保存cookie 下面的测试需要验证登陆的需要设置cookie
  COOKIE = res.headers['set-cookie'].join(';')
})

//修改用户信息
test('修改用户信息，应该成功', async () => {
  const res = await server
      .patch('/api/user/changeInfo')
      .send({
        nickName: '测试昵称',
        picture: '/test.png',
        city: '测试城市'
      })
      .set('cookie', COOKIE) 
  expect(res.body.errno).toBe(0)
})

//修改密码
test('修改用户密码，应该成功', async () => {
  const res = await server
      .patch('/api/user/changePassword')
      .send({
        password,
        newPassword: 'p_123'
      })
  expect(res.body.errno).toBe(0)
})

// 删除
test('删除用户，应该成功', async () => {
  const res = await server
    .post('/api/user/delete')
    //设置 cookie 登陆验证需要
    .set('cookie', COOKIE) 
  expect(res.body.errno).toBe(0)
})

// 退出登录
test('退出登录，应该成功', async () => {
  const res = await server
    .post('/api/user/logout')
    .set('cookie', COOKIE) 
  expect(res.body.errno).toBe(0)
})

// 再次查询用户，应该不存在
test('删除之后，再次查询注册的用户名，应该不存在', async () => {
  const res = await server
    .post('/api/user/isExist')
    .send({
      userName
    })
  expect(res.body.errno).not.toBe(0)
})