var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Login = mongoose.model('login');

/* GET login listing. */
router.get('/', function(req, res, next) {
  //if(!req.body.username) return res.sendResult(null, 400, '用户名不能为空！')
 // if(!req.body.password) return res.sendResult(null, 400, '密码不能为空！')
  Login.find({}, (err, docs) => {
    if(err) {
      res.json(
        {
          success: 'fail',
          data: 'null'
        }
      )
    }else{
      res.json(
        {
          success: 'true',
          data: docs
        }
      )
    }
  })
});

router.post('/',function(req,res,next) {
  Login.find({"userName":req.body.username, "password": req.body.password}, (err, docs) => {
    console.log(docs);
    if(err) {
      res.json(
        {
          success: 'fail',
          data: 'null'
        }
      )
    }else if(docs!=false){
      res.json(
        {
          success: 'true',
          meta:{
            status: 200
          },
          token:'asjhsgkfsklhjsLFSKJBDS'
        }
      )
    }else{
      res.json(
        {
          success: 'fail',
          meta:{
            status: 401
          }
        }
      )
    }
  })
})

module.exports = router;