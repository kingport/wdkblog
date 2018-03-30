const express = require('express')
const router = express.Router()

const PostModel = require('../models/posts') // 引入创建文章及相关代码
const CommentModel = require('../models/comments')

const checkLogin = require('../middlewares/check').checkLogin //未登陆的时候

// GET /posts  所有用户或者特定的用户的文章页面
// eg GET/posts?author=xxx
router.get('/', function (req,res,next) {
  const author = req.query.author

  PostModel.getPosts(author)
    .then(function (posts) {
      res.render('posts', {
        posts: posts
      })
    })
    .catch(next)
})

// POST /posts/create 发表一篇文章
router.post('/create',checkLogin, function (req,res,next) {
    const author = req.session.user._id
    const title = req.fields.title
    const content = req.fields.content

    // 校验参数 是否有标题内容
    try {
      if( !title.length) {
        throw new Error('请填写标题')
      }
      if( !content.length) {
        throw new Error('请填写内容')
      }
    }
    catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }

    let post = {
      author: author,
      title: title,
      content: content
    }
    PostModel.create(post)
      .then(function (result) {
        // post 插入mongodb 后的值 包括 ——id
        post = result.ops[0]
        req.flash('success', '发表成功')
        // 发表成功跳转到 文章详情页面
        res.redirect(`/posts/${post._id}`)
      })
      .catch(next)
})

// GET /posts/create 发表文章页
router.get('/create', checkLogin,function (req,res,next) {
  res.render('create')
})

// GET /posts/:postId 单独一个文章
router.get('/:postId', function (req,res,next) {
  const postId = req.params.postId

  Promise.all([
    PostModel.getPostById(postId), // 获取文章信息
    CommentModel.getComments(postId), //  获取所有文章的留言
    PostModel.incPv(postId) // pv +1
  ])
    .then(function (result) {
      const post = result[0]
      const comments = result[1]
      if(!post) {
        throw new Error('该文章不存在')
      }

      res.render('post', {
        post: post,
        comments: comments
      })
    })
    .catch(next)
})

// GET /posts/:postId/edit 跟新文章页面
router.get('/:postId/edit',checkLogin,function (req,res,next) {
  const postId = req.params.postId
  const author = req.session.user._id

  PostModel.getRawPostById(postId)
  .then(function (post) {
    if( !post){
       throw new Error('改文章不存再')
    }
    if(author.toString() !== post.author._id.toString()) {
      throw new Error('权限不足')
    }
    res.render('edit', {
      post: post
    })
  })
  .catch(next)
})

// POST /posts/:postId/edit 跟新一篇文章
router.post('/:postId/edit',checkLogin,function (req,res,next) {
  const postId = req.params.postId
  const author = req.session.user._id
  const title = req.fields.title
  const content = req.fields.content

  // 校验参数
  try {
    if( !title.length) {
      throw new Error('请填写标题')
    }
    if( !content.length) {
      throw new Error('请写文章内容')
    }
  }
  catch (e) {
    req.flash('error', e.message)
    return res.redirect('back')
  }

  PostModel.getRawPostById(postId)
    .then(function (post) {
      if( !post) {
        throw new Error(' 文章不存在')
      }
      if( post.author._id.toString() !== author.toString()) {
        throw new Error( '没有权限')
      }
      PostModel.updatePostById(postId, {
        title: title,
        content: content
      })
      .then(function () {
        req.flash('success', '编辑文章成功')
        // 编辑成功 跳转上一夜
        res.redirect(`/posts/${postId}`)
      })
      .catch(next)
    })
})

// GET /posts/: postId/remove
router.get('/:postId/remove', checkLogin, function (req,res,next) {
  const postId = req.params.postId
  const author = req.session.user._id

  PostModel.getRawPostById( postId)
    .then(function (post) {
      if( !post) {
        throw new Error('文章不存在')
      }
      if(post.author._id.toString() !== author.toString()) {
        throw new Error('没有权限')
      }
      PostModel.getRawPostById(postId)
      .then(function () {
        req.flash('success', '文章删除成功')
        // 删除成功后跳转到主页
        res.redirect('/posts')
      })
      .catch(next)
    })
})

module.exports = router
