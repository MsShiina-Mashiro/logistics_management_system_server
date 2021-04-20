var mongoose = require('mongoose');

var CategorySchema = new mongoose.Schema({
    id: String,
    item_id: String,
    item_name: String,
    unit: String,
    state: Boolean
});

mongoose.model('category', CategorySchema, 'category');