var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var Page = new Schema({
	name : String
	, body: String
	, nav: String
});

module.exports = mongoose.model('Page', Page);