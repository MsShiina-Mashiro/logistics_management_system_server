var mongoose = require('mongoose');

var WaybillSchema = new mongoose.Schema({
    id: String,
    bill_id: String,
    item_id: String,
    item_name: String,
    from: String,
    to: String,
    delivery_id: String,
    delivery: String,
    phone: String,
    active_step: Number,
    steps: Array
});

mongoose.model('waybill', WaybillSchema, 'waybill');