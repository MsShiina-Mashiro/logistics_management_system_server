var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var Waybill = mongoose.model("waybill");

/* 获取waybill */
router.get("/", function (req, res, next) {
  //if(!req.body.username) return res.sendResult(null, 400, '用户名不能为空！')
  // if(!req.body.password) return res.sendResult(null, 400, '密码不能为空！')
  let pagenum = req.query.pagenum;
  let pagesize = req.query.pagesize;
  // console.log(req.query.query);
  if (req.query.query != "") {
    Waybill.find(
      {
        $or: [
          { bill_id: req.query.query },
          { item_id: req.query.query },
          { item_name: req.query.query },
          { from: req.query.query },
          { to: req.query.query },
          { delivery_id: req.query.query },
          { delivery: req.query.query },
          { phone: req.query.query },
        ],
      },
      (err, docs) => {
        let addList = [];
        for (let i = 0; i < pagesize; i++) {
          let current = (pagenum - 1) * pagesize;
          if (current + i >= docs.length) break;
          addList.push(docs[current + i]);
        }
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
            data: addList,
            meta: {
              status: 200,
            },
            all: docs,
          });
        }
      }
    );
  } else {
    Waybill.find({}, (err, docs) => {
      let addList = [];
      for (let i = 0; i < pagesize; i++) {
        let current = (pagenum - 1) * pagesize;
        if (current + i >= docs.length) break;
        addList.push(docs[current + i]);
      }
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
          data: addList,
          meta: {
            status: 200,
          },
          all: docs,
        });
      }
    });
  }
});
/* 新增条目 */
router.post("/add", function (req, res, next) {
  let params = req.body;
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate;
  let active_step = 1;
  let steps = [
    {
      title: "正在装货",
      description: `货物正在从仓库装货...\r\n${currentdate}`,
      icon: "el-icon-box",
      status: "finish",
    },
    {
      title: "等待运送",
      description: "货物等待运输...",
      icon: "el-icon-truck",
      status: "process",
    },
    {
      title: "等待派送",
      description: "货物等待派送...",
      icon: "el-icon-office-building",
      status: "wait",
    },
    {
      title: "等待签收",
      description: "货物等待签收...",
      icon: "el-icon-document-checked",
      status: "wait",
    },
  ];
  Waybill.insertMany(
    {
      id: params.id,
      bill_id: params.bill_id,
      item_id: params.item_id,
      item_name: params.item_name,
      from: params.from,
      to: params.to,
      delivery_id: params.delivery_id,
      delivery: params.delivery,
      phone: params.phone,
      active_step: active_step,
      steps: steps,
    },
    (err, docs) => {
      if (err) {
        res.json({
          success: "fail",
          meta: {
            status: 400,
          },
        });
      } else {
        res.json({
          success: "true",
          meta: {
            status: 201,
          },
        });
      }
    }
  );
});
/* 删除条目 */
router.delete("/:id", function (req, res, next) {
  Waybill.remove({ id: req.params.id }, (err, docs) => {
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
        meta: {
          status: 200,
        },
      });
    }
  });
});
/* 修改条目 */
router.put("/:id", function (req, res, next) {
  Waybill.updateOne(
    { id: req.params.id },
    {
      $set: {
        item_id: req.body.item_id,
        item_name: req.body.item_name,
        from: req.body.from,
        to: req.body.to,
        delivery_id: req.body.delivery_id,
        delivery: req.body.delivery,
        phone: req.body.phone,
      },
    },
    (err, docs) => {
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
          data: "null",
          meta: {
            status: 200,
          },
        });
      }
    }
  );
});
module.exports = router;
