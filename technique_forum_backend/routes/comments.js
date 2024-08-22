var express = require('express');
var router = express.Router();
// 引入数据库工具
var dbManager = require('../db/db')
// 引入数据结构化方法
var FormatResponse = require('../format/response')

// 新建评论
router.post('/create', function(req, res, next){
    // 首先从请求的数据中获取参数
    var params = req.body;
    // 帖子id
    var post_id = params.post_id;
    // 内容
    var content = params.content;
    // 作者
    var author_id = params.author_id;
    // 回复者
    var reply_to = params.reply_to;
    // 进行有效性校验
    if (!post_id || !author_id || !content) {
        res.status(404).json(FormatResponse.FormatResponse(false, "缺少必填参数", ""));
        return;
    }
    // 进行入库操作
    dbManager.createComment(post_id, author_id, reply_to, content, (success)=>{
        if (success) {
            res.status(200).json(FormatResponse.FormatResponse(true, "", ""));
        } else {
            res.status(404).json(FormatResponse.FormatResponse(false, "评论发布失败", ""));
        }
    });
});

// 删除指定评论
router.delete('/delete', function(req, res, next){
    // 参数对象
    var params = req.body;
    // 帖子id参数
    var id = params.id;
    if (!id) {
        res.status(404).json(FormatResponse.FormatResponse(false, "缺少必要参数", ""));
        return;
    }
    // 删除数据库中数据
    dbManager.deleteComment(id, (success)=>{
        if (success) {
            // 删除成功
            res.status(200).json(FormatResponse.FormatResponse(true, "", ""));
        } else {
            // 删除失败
            res.status(404).json(FormatResponse.FormatResponse(false, "删除失败", ""));
        }
    });
});

// 获取某个帖子下的评论数据
router.get('/comments', function(req, res, next){
    // 参数对象
    var params = req.query;
    // 帖子id参数
    var post_id = params.post_id;
    // 用来进行分页的参数
    var offset = params.offset ? params.offset : 0;
    var limit = params.limit ? params.limit : 10;
    if (!post_id) {
        res.status(500).json(FormatResponse.FormatResponse(false, "缺少必要参数", ""));
        return;
    }
    // 读取数据库评论数据
    dbManager.queryComments(post_id, offset, limit, (data)=>{
        res.status(200).json(FormatResponse.FormatResponse(true, "", data));
    });
});


module.exports = router;