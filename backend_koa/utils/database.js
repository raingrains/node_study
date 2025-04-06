const mysql = require('mysql2');
const {database} = require('../config');

// 创建数据库连接池
const pool = mysql.createPool({
    host: database.host, // 数据库地址
    user: database.user, // 数据库用户名
    password: database.password, // 数据库密码
    database: database.database, // 数据库名称
    port: database.port, // 数据库端口
    charset: 'utf8mb4', // 字符集
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// 使用 promise 包装连接池
const promisePool = pool.promise();

module.exports = promisePool;