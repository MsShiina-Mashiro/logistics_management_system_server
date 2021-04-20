var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
const { param } = require("./login");
var Storage = mongoose.model("storage");

/* 获取仓库信息. */
router.get("/", function (req, res, next) {
  //if(!req.body.username) return res.sendResult(null, 400, '用户名不能为空！')
  // if(!req.body.password) return res.sendResult(null, 400, '密码不能为空！')
  let pagenum = req.query.pagenum;
  let pagesize = req.query.pagesize;
  Storage.find({}, (err, docs) => {
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
});
/* 删除条目 */
router.delete("/:id", function (req, res, next) {
  Storage.remove({ id: req.params.id }, (err, docs) => {
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
  Storage.update(
    { id: req.params.id },
    { $set: { number: req.body.number } },
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
/* 入库 */
router.post("/in", function (req, res, next) {
  let params = req.body;
  Storage.find(
    { item_id: params.item_id, ware_id: params.ware_id },
    (err, docs) => {
      if (err) {
        res.json({
          success: "fail",
          data: "null",
          meta: {
            status: 400,
          },
        });
      } else if (docs == false) {
        Storage.insertMany(
          {
            id: params.id,
            item_id: params.item_id,
            item_name: params.item_name,
            number: params.number,
            unit: params.unit,
            ware_id: params.ware_id,
            ware_name: params.ware_name,
          },
          (err,
          (docs) => {
            res.json({
              success: "true",
              meta: {
                status: 201,
              },
            });
          })
        );
      } else {
        Storage.update(
          { item_id: params.item_id, ware_id: params.ware_id },
          { $set: { number: Number(docs[0].number) + Number(params.number) } },
          (err, docs) => {
            res.json({
              success: "true",
              meta: {
                status: 201,
              },
            });
          }
        );
      }
    }
  );
});
/* 出库 */
router.post("/out", function (req, res, next) {
  let params = req.body;
  let length = req.body.ware_id.length
  let number = Number(params.number)
  if(length == 1){
    Storage.find({ item_id: params.item_id, ware_id: params.ware_id },(err,docs)=>{
      if(Number(docs[0].number)<number){
        res.json({
          success: "fail",
          data: "null",
          meta: {
            status: 400,
          },
        });
      }else{
        Storage.update(
          { item_id: params.item_id, ware_id: params.ware_id },
          { $set: { number: Number(docs[0].number) - Number(params.number) } },
          (err, docs) => {
            res.json({
              success: "true",
              meta: {
                status: 200,
              },
            });
          }
        );
      }
    })
  }else{   // length == 2
    Storage.find({ $or: [ { ware_id: params.ware_id[0] }, { ware_id: params.ware_id[1] } ], $and:[{"item_id":params.item_id}] },(err,docs)=>{
      let allCount = 0
      allCount+=Number(docs[0].number)
      allCount+=Number(docs[1].number)
      if(allCount<number){
        res.json({
          success: "fail",
          data: "null",
          meta: {
            status: 400,
          },
        });
      }else if(Number(docs[0].number)>=number){
        Storage.update(
          { item_id: params.item_id, ware_id: params.ware_id[0] },
          { $set: { number: Number(docs[0].number) - Number(params.number) } },
          (err, docs) => {
            res.json({
              success: "true",
              meta: {
                status: 200,
              },
            });
          }
        );
      }else{
        Storage.remove(
          { item_id: params.item_id, ware_id: params.ware_id[0] }
          ,()=>{
            number -= Number(docs[0].number)
            Storage.update(
              { item_id: params.item_id, ware_id: params.ware_id[1] },
              { $set: { number: Number(docs[1].number) - number } },
              (err, docs) => {
                res.json({
                  success: "true",
                  meta: {
                    status: 200,
                  },
                });
              }
            );
          }
        )
      }
    })
  }
});
module.exports = router;
