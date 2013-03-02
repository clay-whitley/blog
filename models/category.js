var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var Category = new Schema({
	name : String
});

module.exports = mongoose.model('Category', Category);