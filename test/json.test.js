const server = require('./server')


test('json 接口数据是否正确', async () => {
  const res = await server.get('/json')
  expect(res.body).toEqual({
    title: 'koa2 json'
  })
})

test('测试登陆接口', async () => {
  //.send() 模拟请求发送的post数据
  const res = await server.post('/login').send({
    username: 'zhangsan',
    password: '123'
  })
  //......
})