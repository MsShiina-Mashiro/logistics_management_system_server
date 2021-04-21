var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var Transportation = mongoose.model("transportation");

/* waybill中调用 */
router.get("/waybill", function (req, res, next) {
  //if(!req.body.username) return res.sendResult(null, 400, '用户名不能为空！')
  // if(!req.body.password) return res.sendResult(null, 400, '密码不能为空！')
  Transportation.find({ state: true }, (err, docs) => {
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

/* 获取物品信息. */
router.get("/", function (req, res, next) {
  //if(!req.body.username) return res.sendResult(null, 400, '用户名不能为空！')
  // if(!req.body.password) return res.sendResult(null, 400, '密码不能为空！')
  let pagenum = req.query.pagenum;
  let pagesize = req.query.pagesize;
  // console.log(req.query.query);
  if (req.query.query != "") {
    Transportation.find(
      {
        $or: [
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
    Transportation.find({}, (err, docs) => {
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
/* 处理配送员状态 */
router.put("/:id/state/:state", function (req, res, next) {
  let id = req.params.id;
  let state = req.params.state;
  //console.log(id)
  //console.log(state=="true");
  let mg_state = false;
  if (state && state == "true") mg_state = true;
  Transportation.update({ id: id }, { $set: { state: mg_state } }, (err) => {
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
          status: 200,
        },
      });
    }
  });
});
/* 删除条目 */
router.delete("/:id", function (req, res, next) {
  Transportation.remove({ id: req.params.id }, (err, docs) => {
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
  Transportation.updateOne(
    { id: req.params.id },
    { $set: { delivery_id: req.body.delivery_id, delivery: req.body.delivery, phone: req.body.phone } },
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
/* 新增条目 */
router.post("/add", function (req, res, next) {
  let params = req.body;
  Transportation.insertMany(
    {
      id: params.id,
      delivery_id: params.delivery_id,
      delivery: params.delivery,
      phone: params.phone,
      state: params.state,
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
module.exports = router;
