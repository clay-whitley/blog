var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var Post = new Schema({
	sn: String
	, title : String
	, category: String
	, author: String
	, date: { type: Date, default: Date.now }
	, desc: String
	, body: String
});

module.exports = mongoose.model('Post', Post);