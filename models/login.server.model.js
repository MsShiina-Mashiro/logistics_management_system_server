var mongoose = require('mongoose');

var LoginSchema = new mongoose.Schema({
    userName: String,
    password: String
});

mongoose.model('login', LoginSchema, 'login');