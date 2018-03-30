const marked = require('marked')
const Comment = require('../lib/mongo').Comment

// 将 comment 的 内容 转换成html
Comment.plugin('contentToHtml',{
  afterFind: function (comments) {
    return comments.map(function (comment) {
      comment.content = marked(comment.content)
      return comment
    })
  }
})

module.exports = {
  // 创建一个留言
  create: function create(comment) {
    return Comment.create(comment).exec()
  },
  // 通过留言 id 获取一个留言
  getCommentById: function getCommentById(commentId) {
    return Comment.findOne({_id: commentId}).exec()
  },
  // 通过留言 ID 删除一个留言
  getCommentById: function getCommentById(commentId) {
    return Comment.deleteOne({_id: commentId}).exec()
  },
  // 通过文章 id 删除该文章下所有留言
  delCommentsByPostId: function delCommentsByPostId (postId) {
    return Comment.deleteMany({ postId: postId }).exec()
  },
  // 通过文章id 获取该文章下面所有的留言 并且按照时间排序
  getComments: function getComments(postId) {
    return Comment
      .find({ postId: postId})
      .populate({path: 'author', model: 'User'})
      .sort({_id: 1})
      .addCreatedAt()
      .contentToHtml()
      .exec()
  },
  // 通过文章id 获取留言数
  getCommentsCount: function getCommentsCount( postId) {
    return Comment.count({postId: postId}).exec()
  }
}
