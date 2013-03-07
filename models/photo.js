var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var Photo = new Schema({
	name : String,
	file: String,
	album: String
});

module.exports = mongoose.model('Photo', Photo);