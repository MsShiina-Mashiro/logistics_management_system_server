var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var Warehouse = mongoose.model("warehouse");

/* storage中调用 */
router.get("/storage", function (req, res, next) {
  //if(!req.body.username) return res.sendResult(null, 400, '用户名不能为空！')
  // if(!req.body.password) return res.sendResult(null, 400, '密码不能为空！')
  Warehouse.find({}, (err, docs) => {
    if (err) {
      res.json({
        success: "fail",
        data: "null",
        meta: {
          status: 400,
        },
      });
    } else {
      res.json({
        success: "true",
        data: docs,
        meta: {
          status: 200,
        },
      });
    }
  });
});

module.exports = router;
