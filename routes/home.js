var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Home = mongoose.model('home');

/* 获取菜单列表 */
router.get('/', function(req, res, next) {
  //if(!req.body.username) return res.sendResult(null, 400, '用户名不能为空！')
 // if(!req.body.password) return res.sendResult(null, 400, '密码不能为空！')
  Home.find({}, (err, docs) => {
    if(err) {
      res.json(
        {
          success: 'fail',
          meta: {
            status: 400,
            msg: '获取菜单信息失败！'
          }
        }
      )
    }else{
      res.json(
        {
          success: 'true',
          meta: {
            status: 200,
            msg: '获取菜单信息成功！'
          },
          data: docs
        }
      )
    }
  })
});

module.exports = router;