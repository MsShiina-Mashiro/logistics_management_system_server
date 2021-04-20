var mongoose = require('mongoose');
var config = require('./config.js');

module.exports = function() {
    var db = mongoose.connect(config.mongodb);

    require('../models/login.server.model.js');
    require('../models/home.server.model.js')
    require('../models/storage.server.model.js')
    require('../models/warehouse.server.model.js')
    require('../models/category.server.model.js')
    return db;
}