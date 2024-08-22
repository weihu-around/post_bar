var express = require('express');
var router = express.Router();

// 引入数据库工具
var dbManager = require('../db/db')
// 引入数据结构化方法
var FormatResponse = require('../format/response')


// 获取所有分类接口
router.get('/categories', function(req, res, next){
    // 读取数据库类别数据
    dbManager.queryAllCatagories((data)=>{
        res.status(200).json(FormatResponse.FormatResponse(true, "", data));
    })
})

// 获取某个分类下的帖子列表
router.get('/posts', function(req, res, next){
    var params = req.query;
    // 子模块id参数
    var category_id = params.category_id;
    // 用来进行分页的参数
    var offset = params.offset ? params.offset : 0;
    var limit = params.limit ? params.limit : 10;
    if(!category_id) {
        res.status(500).json(FormatResponse.FormatResponse(false, "缺少必要参数", ""));
        return;
    }
    // 读取数据库类别数据
    dbManager.queryPosts(category_id, offset, limit, (data)=>{
        res.status(200).json(FormatResponse.FormatResponse(true, "", data))
    })
})

// 新建帖子
router.post('/create', function(req, res, next){
    // 首先从请求的数据中获取参数
    var params = req.body;
    // 分类id
    var category_id = params.category_id;
    // 标题
    var title = params.title;
    // 摘要
    var summary = params.summary;
    // 内容
    var content = params.content;
    // 作者
    var author_id = params.author_id;
    // 进行有效性校验
    if (!title || !summary || !content || !author_id) {
        res.status(404).json(FormatResponse.FormatResponse(false, "缺少必填参数", ""));
        return;
    }
    // 进行入库操作
    dbManager.createPost(category_id, title, summary, content, author_id, (success)=>{
        if (success) {
            res.status(200).json(FormatResponse.FormatResponse(true, "", ""));
        } else {
            res.status(404).json(FormatResponse.FormatResponse(false, "帖子发布失败", ""));
        }
    });
});


// 获取帖子详情
router.get('/detail', function(req, res, next){
    // 参数对象
    var params = req.query;
    // 帖子id参数
    var id = params.id;
    if (!id) {
        res.status(404).json(FormatResponse.FormatResponse(false, "缺少必要参数", ""));
        return;
    }
    // 读取数据库数据
    dbManager.queryPostDetail(id, (data)=>{
        if (data) {
            // 查询到数据，直接返回
            res.status(200).json(FormatResponse.FormatResponse(true, "", data));
        } else {
            // 查询不到数据，提示异常
            res.status(404).json(FormatResponse.FormatResponse(false, "帖子不存在", ""));
        }
    });
});

// 删除指定帖子
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
    dbManager.deletePost(id, (success)=>{
        if (success) {
            // 删除成功
            res.status(200).json(FormatResponse.FormatResponse(true, "", ""));
        } else {
            // 删除失败
            res.status(404).json(FormatResponse.FormatResponse(false, "删除失败", ""));
        }
    });
});

// 获取某个分类下的帖子列表
router.get('/search', function(req, res, next){
    // 参数对象
    var params = req.query;
    // 查询关键词
    var keyword = params.keyword;
    // 用来进行分页的参数
    var offset = params.offset ? params.offset : 0;
    var limit = params.limit ? params.limit : 10;
    if (!keyword) {
        res.status(500).json(FormatResponse.FormatResponse(false, "缺少必要参数", ""));
        return;
    }
    // 查询数据库帖子数据
    dbManager.searchPosts(keyword, offset, limit, (data)=>{
        res.status(200).json(FormatResponse.FormatResponse(true, "", data));
    });
});


module.exports = router;