/**
 * @description sequelize 同步数据库
 * @author 双越老师
 */

const seq = require('./seq')


// 测试连接
seq.authenticate().then(() => {
  console.log('auth ok')
}).catch(() => {
  console.log('auth err')
})

// 执行同步
seq.sync({
  force: true
}).then(() => {
  console.log('sync ok')
  process.exit()
})