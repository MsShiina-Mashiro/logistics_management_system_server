var mongoose = require('mongoose');

var HomeSchema = new mongoose.Schema({
    menulist: Array
});

mongoose.model('home', HomeSchema, 'home');