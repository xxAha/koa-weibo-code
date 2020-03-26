const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const koaStatic = require('koa-static')
const path = require('path')
//session & redis
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const { REDIS_CONF } = require('../src/conf/db')
const { isProd } = require('./utils/env')
const { SESSION_SECRET_KEY } = require('./conf/secretKeys')


const blogProfileAPIRouter = require('./routes/api/blog-profile')
const blogHomeAPIRouter = require('./routes/api/blog-home')
const blogViewRouter = require('./routes/view/blog')
const userViewRouter = require('./routes/view/user')
const userAPIRouter = require('./routes/api/user')
const utilsAPIRouter = require('./routes/api/utils')

const errorViewRouter = require('./routes/view/error')

// error handler
let onerrorConf = {}
if(isProd) {
  onerrorConf = {
    //程序报错就跳转到错误页面
    redirect: '/error'
  }
}
onerror(app, onerrorConf)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(koaStatic(path.join(__dirname, 'public')))

app.use(koaStatic(path.join(__dirname, '..', 'uploadFiles')))

//配置ejs的跟目录是/views文件夹，后缀是ejs的文件
app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

//配置session
app.keys = [SESSION_SECRET_KEY]
app.use(session({
  key: 'weibo.sid', //cookie的name，默认是koa.sid
  prefix: 'weibo:sess:', //redis key 的前缀，默认是 'koa:sess:'
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
  ttl: 24 * 60 * 60 * 1000, //redis的过期时间，默认是和cookie的maxAge一样，一般不用配置
  store: redisStore({
    //all: 'localhost:6379'
    all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
  })
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes

app.use(blogProfileAPIRouter.routes(), blogProfileAPIRouter.allowedMethods())
app.use(blogHomeAPIRouter.routes(), blogHomeAPIRouter.allowedMethods())
app.use(userViewRouter.routes(), userViewRouter.allowedMethods())
app.use(userAPIRouter.routes(), userAPIRouter.allowedMethods())
app.use(utilsAPIRouter.routes(), utilsAPIRouter.allowedMethods())
app.use(blogViewRouter.routes(), blogViewRouter.allowedMethods())



app.use(errorViewRouter.routes(), errorViewRouter.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
