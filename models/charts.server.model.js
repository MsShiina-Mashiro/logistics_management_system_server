var mongoose = require('mongoose');

var ChartsSchema = new mongoose.Schema({
    type: Number,
    data: Array
});

mongoose.model('charts', ChartsSchema, 'charts');