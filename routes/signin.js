const express = require('express')
const sha1 = require('sha1') // 加密
const router = express.Router()

const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin


// GET /signin 登陆页面

router.get('/',checkNotLogin, function (req,res,next) {
  res.render('signin')
})

// POST /signin 用户登陆
router.post('/',checkNotLogin, function (req,res,next) {
  const name = req.fields.name
  const password = req.fields.password

  // 查询数据库验证用户名以及密码
  try {
    if( !name.length) {
      throw new Error('请填写用户名')
    }
    if( !password.length) {
      throw new Error('请填写密码')
    }
  }
  catch (e) {
    req.flash('error', e.message)
    return req.redirect('back')
  }

  UserModel.getUserByName(name)
    .then(function (user) {
      if( !user) {
        req.flash('error', '用户名不存在')
        return res.redirect('back')
      }
      // 检查密码是否匹配
      if(sha1(password) !== user.password) {
        req.flash('error','用户名或密码错误')
        return res.redirect('back')
      }
      req.flash('success' , '登陆成功')
      // 用户信息写入 session
      delete user.password
      req.session.user = user
      // 跳转到主页
      res.redirect('/posts')
    })
    .catch(next)
})

module.exports = router
