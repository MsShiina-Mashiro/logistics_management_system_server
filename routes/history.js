var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var History = mongoose.model("history");

router.get("/", function(req, res, next){
  let pagenum = req.query.pagenum;
  let pagesize = req.query.pagesize;
  History.find({},(err,docs)=>{
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
        all: docs
      });
    }
  })
})
/* 删除条目 */
router.delete("/:id", function (req, res, next) {
  History.remove({ id: req.params.id }, (err, docs) => {
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
module.exports = router;