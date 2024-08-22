var express = require('express');
var router = express.Router();

// 引入数据库工具
var dbManager = require('../db/db');
const { FormatResponse } = require('../format/response');

/* GET users listing. */
// 默认，查询接口
router.get('/', function(req, res, next) {
  dbManager.queryAllUserInfoFromDB((err, data)=>{
    res.status(200).json(data);
  })
  // res.send('respond with a resource');
});


// 注册接口
router.post('/create', function(req, res, next){
  var params = req.body;
  var account = params.account;
  var password = params.password;
  var nickname = params.nickname;
  // 进行有效性校验
  if (!account || !password || !nickname){
    res.status(404).json(FormatResponse(false, "缺少必填参数", ""));
    return;
  }
  // 查询数据库中用户是否已存在
  dbManager.accountIfExist(account, (exist)=>{
    if (exist){
      // 账户已存在
      res.status(409).json(FormatResponse(false, "账户已存在， 请更换进行注册", ""))
    } else {
      // 账户不存在，进行写库注册
      dbManager.createAccount(nickname, account, password, (err, user)=>{
        if(err) {
          // 写入异常，返回注册失败
          res.status(404).json(FormatResponse(false, "注册失败", ""))
        } else {
          // 写入成功，将完整的用户数据进行返回
          res.status(200).json(FormatResponse(true, "", user))
        }
      })
    }
  })
})

// 登录接口
router.get('/login', function(req, res, next){
  // 获取登录的账户和密码参数
  var params = req.query;
  var account = params.account;
  var password = params.password;
  // 进行有效性校验
  if (!account || !password){
    res.status(404).json(FormatResponse(false, `账户或密码不能为空`, ""));
    return;
  }
  // 读取数据库用户数据
  dbManager.queryUser(account, (err, user)=>{
    console.log(password, user)
    if (user){
      // 如果读取到用户数据，则判断密码是否正确
      if (user.password == password) {
        res.status(200).json(FormatResponse(true, "", user));
      } else {
        res.status(500).json(FormatResponse(false, "密码错误", ""));
      }
    } else {
      // 没有读取到用户数据，返回提示注册
      res.status(404).json(FormatResponse(false, "不存在的账户，请先注册", ""));
    }
  })
});

module.exports = router;
