var mongoose = require('mongoose');

var HistorySchema = new mongoose.Schema({
    id: String,
    type: String,
    item_id: String,
    item_name: String,
    number: String,
    unit: String,
    out_ware_id: String,
    out_ware_name: String,
    in_ware_id: String,
    in_ware_name: String,
    date: String
});

mongoose.model('history', HistorySchema, 'history');