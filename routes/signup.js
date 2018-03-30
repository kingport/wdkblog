const fs = require('fs')
const path = require('path')
const sha1 = require('sha1')
const express = require('express')
const router = express.Router()


const UserModel = require('../models/users')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signup 注册页面
router.get('/', checkNotLogin, function (req,res,next) {
  res.render('signup')
})

// POST /signup 用户注册

router.post('/', checkNotLogin ,function (req,res,next) {
  // console.log('====================================');
  // console.log(req.fields);
  // console.log('====================================');
  const name = req.fields.name
  const gender = req.fields.gender
  const bio = req.fields.bio
  // const avatar = req.fields.avatar.path.split(path.sep).pop()
  let password = req.fields.password
  const repassword = req.fields.repassword

  // 校验参数
  try {
    if( !(name.length >= 1 && name.length <= 10)) {
      throw new Error('名字限制1-10个字符')
    }
    if(['m','f','x'].indexOf(gender) === -1) {
      throw new Error( '性别只能是规定的')
    }
    if( !(bio.length >= 1 && bio.length <=30)) {
      throw new Error('不要啰嗦个人简介')
    }
    // if( !req.files.avatar.name) {
    //   throw new Error('缺少头像')
    // }
    if(password.length < 6) {
      throw new Error( '密码长度不少于6位')
    }
    if(password !== repassword) {
      throw new Error('两次密码不一样')
    }
  }catch (e) {
    // 注册失败
    fs.unlink(req.files.avatar.path)
    req.flash('error',e.message)
    return res.redirect('/signup')
  }

  // 明文 密码加密
  password = sha1(password)

  // 等待写入数据库的用户信息
  let user = {
    name: name,
    password: password,
    gender: gender,
    bio: bio
    // avatar:avatar
  }
  // 用户信息写入数据库
  UserModel.create(user)
    .then(function (result) {
      // user 插入 mongodb h后的值 包含_id
      user = result.ops[0]
      // 删除密码信息 将用户信息存入session
      delete user.password
      req.session.user = user
      // 写入 flash
      req.flash( 'success', '注册成功')
      // 跳转到首页
      res.redirect('/posts')
    })
    .catch( function (e) {
      // 注册失败 删除上传的头像
      fs.unlink(req.files.avatar.path)

      if(e.message.match('duplicate key')) {
        req.flash('error', '用户名已经注册')
        return res.redirect('/signup')
      }
      next(e)
    })
})

module.exports = router
