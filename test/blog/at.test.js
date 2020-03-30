/**
 * @description @ API test
 * @author 双越老师
 */

const server = require('../server')
const { Z_COOKIE, L_COOKIE, L_USER_NAME, L_ID } = require('../testUserInfo')
const { changeAtRelationToRead, getAtMeCount } = require('../../src/controller/blog-at')

let BLOG_ID

test('张三创建一个微博并且@李四，应该成功', async () => {
  const content = `单元测试创建微博 @李四 - ${L_USER_NAME}`
  const res = await server
      .post('/api/blog/create')
      .send({
        content
      })
      .set('cookie', Z_COOKIE)
  expect(res.body.errno).toBe(0)
  //保存博客ID
  BLOG_ID = res.body.data.id
})

test('获取李四的@列表(第一页)，应该有刚刚发布的博客', async () => {
  const res = await server
      .get('/api/atMe/loadMore/0')
      .set('cookie', L_COOKIE)

  expect(res.body.errno).toBe(0)

  const blogList = res.body.data.blogList
  const isHaveCurBlog = blogList.some(blog => blog.id === BLOG_ID)

  expect(isHaveCurBlog).toBe(true)
  
})

test('@消息已读测试', async () => {
  await changeAtRelationToRead(L_ID)
  const result = await getAtMeCount(L_ID)
  const count = result.data.count
  expect(count).toBe(0)
})