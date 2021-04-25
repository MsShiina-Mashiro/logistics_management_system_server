var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var app = express()
var mongoose = require('./config/mongoose.js');
var db = mongoose();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

var login = require('./routes/login');
var home = require('./routes/home');
var storage = require('./routes/storage');
var category = require('./routes/category');
var warehouse = require('./routes/warehouse');
var waybill = require('./routes/waybill');
var transportation = require('./routes/transportation');
var charts = require('./routes/charts');

// 设置跨域和相应数据格式
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, mytoken')
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, Authorization')
  res.setHeader('Content-Type', 'application/json;charset=utf-8')
  res.header('Access-Control-Allow-Headers', 'Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('X-Powered-By', ' 3.2.1')
  if (req.method == 'OPTIONS') res.send(200)
  /*让options请求快速返回*/ else next()
})

app.use('/login',login)
app.use('/home',home)
app.use('/storage',storage)
app.use('/category',category)
app.use('/warehouse',warehouse)
app.use('/transportation',transportation)
app.use('/waybill',waybill)
app.use('/charts',charts)

app.listen(8888, () => {
  console.log('listening at port 8888...');
})