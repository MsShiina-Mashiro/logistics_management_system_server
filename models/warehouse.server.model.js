var mongoose = require('mongoose');

var WarehouseSchema = new mongoose.Schema({
    id: String,
    ware_id: String,
    ware_name: String
});

mongoose.model('warehouse', WarehouseSchema, 'warehouse');