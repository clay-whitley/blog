var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var Post = new Schema({
	sn: String
	, title : String
	, category: String
	, desc: String
	, body: String
});

module.exports = mongoose.model('Post', Post);