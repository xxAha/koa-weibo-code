/**
 * @description Sequelize的实例
 */

const Sequelize = require('sequelize')
const { MYSQL_CONF } = require('../conf/db')
const { isProd, isTest } = require('../utils/env')

const { host, user, password, database } = MYSQL_CONF
const conf = {
  host,
  dialect: 'mysql'
}

//测试环境控制台不打印sql语句
if(isTest) {
  conf.logging = () => {}
}

if(isProd){
  //线上环境使用连接池
  conf.pool = {
    max: 5, // 连接池中最大的连接数量
    min: 0, // 连接池中最小的连接数量
    idle: 10000 // 如果一个连接池 10s 之内没有被使用，则释放
  }
}


const seq = new Sequelize(database, user, password, conf)

module.exports = seq