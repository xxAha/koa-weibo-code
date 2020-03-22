const request = require('supertest')
//require('../src/app') -> 引入了koa的实例
//.callback() -> 获取实例的每一次请求
const server = require('../src/app').callback()

module.exports = request(server)