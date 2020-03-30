/**
 * @description user relation test
 */

const {
  Z_COOKIE,
  Z_ID,
  Z_USER_NAME,
  L_ID,
  L_USER_NAME
} = require('../testUserInfo')
//没有路由的时候，也可以引入controller的来进行测试
const { getFans, getFollowers } = require('../../src/controller/user-relation')
const server = require('../server')

//初始化测试环境
test('先取消张三对李四的关注，初始化测试环境', async () => {
  await server
      .post('/api/profile/unFollow')
      .send({ userId: L_ID })
      .set('cookie', Z_COOKIE)
  expect(1).toBe(1)
})

//张三关注李四
test('张三关注李四，应该成功', async () => {
  const result = await server
      .post('/api/profile/follow')
      .send({ userId: L_ID })
      .set('cookie', Z_COOKIE)
  expect(result.body.errno).toBe(0)
})

//获取李四的粉丝列表
test('获取李四的粉丝列表，应该有张三', async () => {
  const result = await getFans(L_ID)
  const { fansCount, fansList } = result.data
  const hasUserName = fansList.some(fan => fan.userName === Z_USER_NAME)
  expect(fansCount > 0).toBe(true)
  expect(hasUserName).toBeTruthy()
})

//获取张三的关注列表
test('获取张三的关注列表，应该有李四', async () => {
  const result = await getFollowers(Z_ID)
  const { followCount, followList } = result.data
  const hasUserName = followList.some(follower => follower.userName === L_USER_NAME)
  expect(followCount > 0).toBe(true)
  expect(hasUserName).toBeTruthy()
})

//获取张三的@列表
test('获取张三的@列表，应该有李四', async () => {
  const res = await server
      .get('/api/user/getAtList')
      .set('cookie', Z_COOKIE)
  const atList = res.body
  const hasUserName = atList.some(item => {
    return item.indexOf(`- ${L_USER_NAME}`) > 0
  })
  expect(hasUserName).toBe(true)
})

//张三取消关注李四
test('张三取消关注李四，应该成功', async () => {
  const result = await server
      .post('/api/profile/unFollow')
      .send({ userId: L_ID })
      .set('cookie', Z_COOKIE)
  expect(result.body.errno).toBe(0)
})