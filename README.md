## 1. 目录详解

 -- 对应文件及文件夹的用处：

 -- models: 存放操作数据库的文件
 
 -- public: 存放静态文件，如样式、图片等
 
 -- routes: 存放路由文件
 
 -- views: 存放模板文件
 
 -- index.js: 程序主文件
 
 -- package.json: 存储项目名、描述、作者、依赖等等信息

# 2. 安装模块用处
-- express: web 框架
|

-- express-session: session 中间件
|

-- connect-mongo: 将 session 存储于 mongodb，结合 express-session 使用
|

-- connect-flash: 页面通知的中间件，基于 session 实现
|

-- ejs: 模板
|

-- express-formidable: 接收表单及文件上传的中间件
|

-- config-lite: 读取配置文件
|

-- marked: markdown 解析
|

-- moment: 时间格式化
|

-- mongolass: mongodb 驱动
|

-- objectid-to-timestamp: 根据 ObjectId 生成时间戳
|

-- sha1: sha1 加密，用于密码加密
|

-- winston: 日志
|

-- express-winston: express 的 winston 日志中间件



# 3 安装eslint 语法检查

-- npm i eslint -g

-- 运行：

-- eslint --init

-- 初始化 eslint 配置，依次选择：

-- -> Use a popular style guide

-- -> Standard

-- -> JSON


# 4 代码缩进规范工具
-- EditorConfig 需要结合编辑器或 IDE 使用，如：

-- Sublime Text 需要装一个插件：EditorConfig

-- VS Code 需要装一个插件：EditorConfig for VS Code


-- 在 myblog 目录下新建 .editorconfig 的文件，添加如下内容：

-- editorconfig.org

-- root = true


-- [*]

-- indent_style = space

-- indent_size = 2

-- end_of_line = lf

-- charset = utf-8

-- trim_trailing_whitespace = true

-- insert_final_newline = true

-- tab_width = 2


-- [*.md]

-- trim_trailing_whitespace = false

-- [Makefile]

-- indent_style = tab

# 5 配置文件
-- 新建 config 文件夹 

# 6 明确功能与路由设计
## 注册
----     注册页: GET/ signup

----     注册（包含上传头像）POST/ signup

## 登陆
  --  登陆页面: GET
  
  --  登陆: POST

##  退出登陆
#     GET

##  查看文章
--       主页: GET/posts

--       个人主页: GET/posts?author=xxx

--       查看一篇文章（包含留言）: GET/posts/:postId

## 发表文章
--       发表文章页: GET/posts/create

--       发表文章:GET/posts/create


## 修改文章
--      修改文章页: GET/posts/:postId/edit

## 删除文章
--       删除文章: GET /posts/:postId/remove

## 留言 功能
--      创建留言: POST/comments

--      删除留言: GET/comments/:commentId/remove

