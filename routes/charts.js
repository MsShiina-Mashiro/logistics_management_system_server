var express = require("express");
var router = express.Router();

var mongoose = require("mongoose");
var Charts = mongoose.model("charts");

router.get("/type/1", function(req, res, next){
  Charts.find({type:1},(err,docs)=>{
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
        data: docs[0].data,
        meta: {
          status: 200,
        },
      });
    }
  })
})

module.exports = router;