var mongoose = require('mongoose');

var TransSchema = new mongoose.Schema({
    id: String,
    delivery_id: String,
    delivery: String,
    phone: String,
    state: Boolean
});

mongoose.model('transportation', TransSchema, 'transportation');