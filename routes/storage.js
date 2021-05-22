var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
const { param } = require("./login");
var Storage = mongoose.model("storage");
var History = mongoose.model("history");

/* 获取仓库信息. */
router.get("/", function (req, res, next) {
  //if(!req.body.username) return res.sendResult(null, 400, '用户名不能为空！')
  // if(!req.body.password) return res.sendResult(null, 400, '密码不能为空！')
  let pagenum = req.query.pagenum;
  let pagesize = req.query.pagesize;
  // console.log(req.query.query);
  if (req.query.query != "") {
    Storage.find(
      {
        $or: [
          { ware_id: req.query.query },
          { item_id: req.query.query },
          { item_name: req.query.query },
          { ware_name: req.query.query },
          { number: req.query.query },
          { unit: req.query.query },
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
  }
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
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var strHour = date.getHours();
  var strMin = date.getMinutes();
  var strSec = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (strHour >= 0 && strHour <= 9) {
    strHour = "0" + strHour;
  }
  if (strMin >= 0 && strMin <= 9) {
    strMin = "0" + strMin;
  }
  if (strSec >= 0 && strSec <= 9) {
    strSec = "0" + strSec;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + strHour + ':' + strMin + ':' + strSec;
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
            History.insertMany(
              {
                id:params.id,
                type: '入库',
                item_id: params.item_id,
                item_name: params.item_name,
                number: params.number,
                unit: params.unit,
                in_ware_id: params.ware_id,
                date: currentdate
              },
              (err, docs)=>{
                res.json({
                  success: "true",
                  meta: {
                    status: 201,
                  },
                });
              }
            )
          })
        );
      } else {
        Storage.update(
          { item_id: params.item_id, ware_id: params.ware_id },
          { $set: { number: Number(docs[0].number) + Number(params.number) } },
          (err, docs) => {
            History.insertMany(
              {
                id:params.id,
                type: '入库',
                item_id: params.item_id,
                item_name: params.item_name,
                number: params.number,
                unit: params.unit,
                in_ware_id: params.ware_id,
                date: currentdate
              },
              (err, docs)=>{
                res.json({
                  success: "true",
                  meta: {
                    status: 201,
                  },
                });
              }
            )
          }
        );
      }
    }
  );
});
/* 出库 */
router.post("/out", function (req, res, next) {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var strHour = date.getHours();
  var strMin = date.getMinutes();
  var strSec = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (strHour >= 0 && strHour <= 9) {
    strHour = "0" + strHour;
  }
  if (strMin >= 0 && strMin <= 9) {
    strMin = "0" + strMin;
  }
  if (strSec >= 0 && strSec <= 9) {
    strSec = "0" + strSec;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + strHour + ':' + strMin + ':' + strSec;
  let params = req.body;
  let length = req.body.ware_id.length;
  let number = Number(params.number);
  if (length == 1) {
    Storage.find(
      { item_id: params.item_id, ware_id: params.ware_id },
      (err, docs) => {
        if (Number(docs[0].number) < number) {
          res.json({
            success: "fail",
            data: "null",
            meta: {
              status: 400,
            },
          });
        } else if (Number(docs[0].number) > number) {
          Storage.update(
            { item_id: params.item_id, ware_id: params.ware_id },
            {
              $set: { number: Number(docs[0].number) - Number(params.number) },
            },
            (err, docs) => {
              History.insertMany(
                {
                  id:params.id,
                  type: '出库',
                  item_id: params.item_id,
                  item_name: params.item_name,
                  number: params.number,
                  unit: params.unit,
                  out_ware_id: params.ware_id[0],
                  date: currentdate
                },
                (err, docs)=>{
                  res.json({
                    success: "true",
                    meta: {
                      status: 200,
                    },
                  });
                }
              )
            }
          );
        } else {
          Storage.remove(
            { item_id: params.item_id, ware_id: params.ware_id },
            () => {
              History.insertMany(
                {
                  id:params.id,
                  type: '出库',
                  item_id: params.item_id,
                  item_name: params.item_name,
                  number: params.number,
                  unit: params.unit,
                  out_ware_id: params.ware_id[0],
                  date: currentdate
                },
                (err, docs)=>{
                  res.json({
                    success: "true",
                    meta: {
                      status: 200,
                    },
                  });
                }
              )
            }
          );
        }
      }
    );
  } else {
    // length == 2
    Storage.find(
      {
        $or: [{ ware_id: params.ware_id[0] }, { ware_id: params.ware_id[1] }],
        $and: [{ item_id: params.item_id }],
      },
      (err, docs) => {
        let allCount = 0;
        allCount += Number(docs[0].number);
        allCount += Number(docs[1].number);
        if (allCount < number) {
          res.json({
            success: "fail",
            data: "null",
            meta: {
              status: 400,
            },
          });
        } else if (Number(docs[0].number) > number) {
          // console.log(Number(docs[0].number));
          Storage.update(
            { item_id: docs[0].item_id, ware_id: docs[0].ware_id },
            {
              $set: { number: Number(docs[0].number) - Number(params.number) },
            },
            (err, docs) => {
              History.insertMany(
                {
                  id:params.id,
                  type: '出库',
                  item_id: params.item_id,
                  item_name: params.item_name,
                  number: params.number,
                  unit: params.unit,
                  out_ware_id: `${params.ware_id[0]}, ${params.ware_id[1]}`,
                  date: currentdate
                },
                (err, docs)=>{
                  res.json({
                    success: "true",
                    meta: {
                      status: 200,
                    },
                  });
                }
              )
            }
          );
        } else {
          Storage.remove(
            { item_id: docs[0].item_id, ware_id: docs[0].ware_id },
            () => {
              number -= Number(docs[0].number);
              if (number < Number(docs[1].number)) {
                Storage.update(
                  { item_id: docs[1].item_id, ware_id: docs[1].ware_id },
                  { $set: { number: Number(docs[1].number) - number } },
                  (err, docs) => {
                    History.insertMany(
                      {
                        id:params.id,
                        type: '出库',
                        item_id: params.item_id,
                        item_name: params.item_name,
                        number: params.number,
                        unit: params.unit,
                        out_ware_id: `${params.ware_id[0]}, ${params.ware_id[1]}`,
                        date: currentdate
                      },
                      (err, docs)=>{
                        res.json({
                          success: "true",
                          meta: {
                            status: 200,
                          },
                        });
                      }
                    )
                  }
                );
              } else if (number == Number(docs[1].number)) {
                Storage.remove(
                  { item_id: docs[1].item_id, ware_id: docs[1].ware_id },
                  () => {
                    History.insertMany(
                      {
                        id:params.id,
                        type: '出库',
                        item_id: params.item_id,
                        item_name: params.item_name,
                        number: params.number,
                        unit: params.unit,
                        out_ware_id: `${params.ware_id[0]}, ${params.ware_id[1]}`,
                        date: currentdate
                      },
                      (err, docs)=>{
                        res.json({
                          success: "true",
                          meta: {
                            status: 200,
                          },
                        });
                      }
                    )
                  }
                );
              }
            }
          );
        }
      }
    );
  }
});
/* 越库 */
router.post("/trans", function (req, res, next) {
  var date = new Date();
  var seperator1 = "-";
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  var strHour = date.getHours();
  var strMin = date.getMinutes();
  var strSec = date.getSeconds();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  if (strHour >= 0 && strHour <= 9) {
    strHour = "0" + strHour;
  }
  if (strMin >= 0 && strMin <= 9) {
    strMin = "0" + strMin;
  }
  if (strSec >= 0 && strSec <= 9) {
    strSec = "0" + strSec;
  }
  var currentdate = year + seperator1 + month + seperator1 + strDate + ' ' + strHour + ':' + strMin + ':' + strSec;
  let params = req.body;
  let number = Number(params.number);
  Storage.find(
    { item_id: params.item_id, ware_id: params.from_ware_id },
    (err, docs) => {
      if (Number(docs[0].number) < number) {
        res.json({
          success: "fail",
          data: "null",
          meta: {
            status: 400,
          },
        });
      } else if (Number(docs[0].number) == number) {
        Storage.remove(
          { item_id: params.item_id, ware_id: params.from_ware_id },
          () => {
            Storage.find(
              { item_id: params.item_id, ware_id: params.to_ware_id },
              (err2, docs2) => {
                if (docs2 == false) {
                  Storage.insertMany(
                    {
                      id: params.id,
                      item_id: params.item_id,
                      item_name: params.item_name,
                      number: params.number,
                      unit: params.unit,
                      ware_id: params.to_ware_id,
                      ware_name: params.ware_name,
                    },
                    (err,
                    (docs) => {
                      History.insertMany(
                        {
                          id:params.id,
                          type: '越库',
                          item_id: params.item_id,
                          item_name: params.item_name,
                          number: params.number,
                          unit: params.unit,
                          in_ware_id: params.to_ware_id,
                          out_ware_id: params.from_ware_id,
                          date: currentdate
                        },
                        (err, docs)=>{
                          res.json({
                            success: "true",
                            meta: {
                              status: 200,
                            },
                          });
                        }
                      )
                    })
                  );
                } else {
                  Storage.update(
                    { item_id: params.item_id, ware_id: params.to_ware_id },
                    { $set: { number: Number(docs2[0].number) + number } },
                    (err, docs) => {
                      History.insertMany(
                        {
                          id:params.id,
                          type: '越库',
                          item_id: params.item_id,
                          item_name: params.item_name,
                          number: params.number,
                          unit: params.unit,
                          in_ware_id: params.to_ware_id,
                          out_ware_id: params.from_ware_id,
                          date: currentdate
                        },
                        (err, docs)=>{
                          res.json({
                            success: "true",
                            meta: {
                              status: 200,
                            },
                          });
                        }
                      )
                    }
                  );
                }
              }
            );
          }
        );
      } else {
        Storage.update(
          { item_id: params.item_id, ware_id: params.from_ware_id },
          { $set: { number: Number(docs[0].number) - number } },
          () => {
            Storage.find(
              { item_id: params.item_id, ware_id: params.to_ware_id },
              (err2, docs2) => {
                if (docs2 == false) {
                  Storage.insertMany(
                    {
                      id: params.id,
                      item_id: params.item_id,
                      item_name: params.item_name,
                      number: params.number,
                      unit: params.unit,
                      ware_id: params.to_ware_id,
                      ware_name: params.ware_name,
                    },
                    (err,
                    (docs) => {
                      History.insertMany(
                        {
                          id:params.id,
                          type: '越库',
                          item_id: params.item_id,
                          item_name: params.item_name,
                          number: params.number,
                          unit: params.unit,
                          in_ware_id: params.to_ware_id,
                          out_ware_id: params.from_ware_id,
                          date: currentdate
                        },
                        (err, docs)=>{
                          res.json({
                            success: "true",
                            meta: {
                              status: 200,
                            },
                          });
                        }
                      )
                    })
                  );
                } else {
                  Storage.update(
                    { item_id: params.item_id, ware_id: params.to_ware_id },
                    { $set: { number: Number(docs2[0].number) + number } },
                    (err, docs) => {
                      History.insertMany(
                        {
                          id:params.id,
                          type: '越库',
                          item_id: params.item_id,
                          item_name: params.item_name,
                          number: params.number,
                          unit: params.unit,
                          in_ware_id: params.to_ware_id,
                          out_ware_id: params.from_ware_id,
                          date: currentdate
                        },
                        (err, docs)=>{
                          res.json({
                            success: "true",
                            meta: {
                              status: 200
                            },
                          });
                        }
                      )
                    }
                  );
                }
              }
            );
          }
        );
      }
    }
  );
});
module.exports = router;
