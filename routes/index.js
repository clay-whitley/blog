var Post = require('../models/post.js');
var User = require('../models/user.js');
var Category = require('../models/category.js');
var Album = require('../models/album.js');
var Photo = require('../models/photo.js');
/*
 * GET home page.
 */

exports.index = function(req, res){
	Post
	.find({})
	.sort('-sn')
	.exec(function(err, docs){
		if (err) {
			res.send(err);
		} else {
			console.log(req.session);
			Category.find({}, function(err,cats){
				if (err) {
					res.send(err);
				} else {
					res.render('index', {title: 'Index', docs: docs, cats: cats});
				}
			});
			
		}
	});
};

exports.adduser = function(req, res){
	var user = {
		username: req.body.username
		, password: req.body.password
	};
	var userObj = new User(user);
	userObj.save(function(err, data){
		if (err) {
			res.send(err);
		} else {
			console.log(data);
			res.redirect("/");
		}
	});
};

exports.login = function(req, res){
	User.findOne({username: req.body.username, password: req.body.password}, function(err, doc){
		if (err) {
			res.send(err);
		} else if (!doc) {
			res.send('User not found');
		} else {
			req.session.loggedIn = doc._id.toString();
			console.log(doc);
			res.redirect('/');
		}			

	});
};

exports.logout = function(req, res){
	req.session.loggedIn = null;
	res.redirect('/');
};

exports.loginform = function(req, res){
	res.render('login', {title: 'Login'});
};

exports.registerform = function(req, res){
	res.render('register', {title: 'Register'});
};

exports.test = function(req, res){
	res.render('index', { title: req.params.test });
};

exports.postform = function(req, res){
	Category.find({}, function(err, cats){
		if (err) res.send(err);
		res.render('postform', {title: 'Form', cats: cats});
	});
};

exports.addpost = function(req, res){
	Post.count({}, function(err, count){
		console.log(count);
		var sn = count + 1;
			var post = {
				sn: sn
				, title: req.body.posttitle
				, category: req.body.postcategory || req.body.postcatchoice
				, desc: req.body.postdesc
				, body: req.body.postbody
			};
			var postObj = new Post(post);
			postObj.save(function(err, data) {
				if (err) {
					res.send(err);
			} else {
					console.log(data);
					Category.findOne({name: req.body.postcategory}, function(err,doc){
						if (err) {
							res.send(err);
						} else if (!doc) {
							Category.create({name:req.body.postcategory}, function(err,doc){
								if (err) {
									res.send(err);
								} else {
									console.log(doc);
									res.redirect('/');
								}
							});
						} else {
							console.log('tripp');
							res.redirect('/');
						}
					});
					
				}
			});
		

	});
};

exports.viewpost = function(req, res){
	var sn = req.params.sn;
	Post.findOne({sn: sn}, function(err, doc){
		if (err) {
			res.send(err);
		} else {
			res.render('viewpost', {title: 'View', post: doc});
		}
	});
	
};

exports.viewcat = function(req, res){
	Post.find({category:req.params.cat}, function(err, docs){
		if (err) {
			res.send(err);
		} else {
			console.log(docs);
			Category.find({}, function(err, cats){
				if (err) res.send(err);
				res.render('index', {title: req.params.cat, docs: docs, cats: cats});
			});
			
		}
	});
};

exports.updateform = function(req, res){
	var sn = req.params.sn;
	Post.findOne({sn: sn}, function(err, doc){
		if (err) {
			res.send(err);
		} else {
			Category.find({}, function(err,cats){
				if (err) res.send(err);
				res.render('updateform', {title: 'Update', post: doc, cats: cats});
			});
		}
	});
};

exports.updatepost = function(req, res){
	var sn = req.params.sn;
	var post = {
		sn: sn
		, title: req.body.posttitle
		, category: req.body.postcategory || req.body.postcatchoice
		, desc: req.body.postdesc
		, body: req.body.postbody
	};
	Post.update({sn: sn}, post, function(err){
		if (err) {
			res.send(err);
		} else {
			res.redirect('/');
		}
	});
};

exports.viewalbums = function(req, res){
	Album.find({}, function(err, albums){
		if (err) res.send(err);
		res.render('viewalbums', {title: 'Albums', albums: albums});
	});
};

exports.addalbumform = function(req, res){
	res.render('addalbumform', {title: 'Add Album'});
};

exports.addalbum = function(req, res){
	var album = {
		name: req.body.albumname,
		thumbnail: req.body.albumthumbnail
	};
	Album.create(album, function(err,album){
		if (err) res.send(err);
		console.log(album);
		res.redirect('/gallery/albums');
	});
};

exports.viewalbum = function(req, res){
	Album.findOne({_id: req.params.id}, function(err,album){
		if (err) res.send(err);
		console.log(album);
		res.render('viewalbum', {title: album.name});
	});
};

