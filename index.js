const path = require('path')
const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const flash = require('connect-flash')
const config = require('config-lite')(__dirname)
const routes = require('./routes')
const pkg = require('./package')
// 记录日志
const winston = require('winston')
const expressWinston = require('express-winston')

const app = express()

// 设置模版存放目录 第一个参数必须是views
app.set('views', path.join(__dirname, 'views'))
// 设置模版引擎 ejs
app.set('view engine', 'ejs')

//设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))

// session 中间件
app.use(session({
  name: config.session.key, // 通过cookie保存 session id 字段名称
  secret: config.session.secret, // 设置secret 来计算hash 放在cookie 中 使signedCookie 防止篡改
  resave: true, // 强制更新 session
  saveUninitialized: false, // 强制创建一个session 使得用户未登陆
  cookie: {
    maxAge: config.session.maxAge // 过期时间 过期后 cookie中的 session id 自动删除
  },
  store: new MongoStore({ // 将session 存储到mongodb中
    url: config.mongodb  // 地址
  })
}))

// flash 中间件 用来显示提示以及通知
app.use(flash())

// 处理表单及文件上传的中间件
app.use(require('express-formidable')({
  uploadDir: path.join(__dirname, 'public/img'),
  keepExtensions: true // 保留后缀
}))

// 设置模版全局变量
app.locals.blog = {
  title: 'WDKBLOG',
  description: pkg.description
}

// 添加模版必须的三个常量
app.use(function (req,res,next) {
  res.locals.user = req.session.user
  res.locals.success = req.flash('success').toString()
  res.locals.error = req.flash('error').toString()
  next()
})

// 路由
// routes(app)
// 正常请求的日志
app.use(expressWinston.logger({
  transports: [
    new (winston.transports.Console)({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/success.log'
    })
  ]
}))
// 路由
routes(app)
// 错误的请求日志
app.use(expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({
      json: true,
      colorize: true
    }),
    new winston.transports.File({
      filename: 'logs/error.log'
    })
  ]
}))


if (module.parent) {
  // 被 require，则导出 app
  module.exports = app
} else {
  // 监听端口，启动程序
  app.listen(config.port, function () {
    console.log(`${pkg.name} listening on port ${config.port}`)
  })
}
