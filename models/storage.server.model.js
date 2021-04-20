var mongoose = require('mongoose');

var StorageSchema = new mongoose.Schema({
    id: String,
    item_id: String,
    item_name: String,
    number: String,
    unit: String,
    ware_id: String,
    ware_name: String,
});

mongoose.model('storage', StorageSchema, 'storage');