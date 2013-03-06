var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var Album = new Schema({
	name : String,
	thumbnail: String
});

module.exports = mongoose.model('Album', Album);