const config = require('config-lite')(__dirname)
const Mongolass = require('mongolass')
const mongolass = new Mongolass()
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
mongolass.connect(config.mongodb)

// 根据id 生成创建时间 created_at
mongolass.plugin('addCreatedAt', {
  afterFind: function (results) {
    results.forEach(function (item) {
      item.created_at = moment(objectIdToTimestamp(item._id)).format('YYY-MM-DD HH:mm')
    })
    return results
  },
  afterFindOne: function (result) {
    if(result) {
      result.created_at = moment(objectIdToTimestamp(result._id)).format('YYY-MM-DD HH:mm')
    }
    return result
  }
})
// 创建用户保存字段
exports.User = mongolass.model('User', {
  name: {type: 'string', required: true},
  password: {type: 'string', required: true},
  // avatar: {type: 'string', required: true},
  gender: {type: 'string', enum:['m','f','x'],default: 'x'},
  bio: {type: 'string', required: true}
})
exports.User.index(
  {
  name: 1
  },
  {
    unique: true
  }
).exec() // 根据用户名找到用户

// 存储文章作者的id 标题 正文 点击量 这几个字段
exports.Post = mongolass.model('Post', {
  author: {type: Mongolass.Types.ObjectId, required: true},
  title: {type: 'string', required: true},
  content: {type: 'string', required: true},
  pv: {type: 'number', default: 0}
})

exports.Post.index({author: 1, _id: -1}).exec() // 按创建时间 降序 查看用户的文章列表

// 留言
exports.Comment = mongolass.model('Comment', {
  author: {type: Mongolass.Types.ObjectId, required: true},
  content: {type: 'string', required: true},
  postId: {type: Mongolass.Types.ObjectId, required: true}
})

exports.Comment.index({postId: 1, _id:1}).exec()


