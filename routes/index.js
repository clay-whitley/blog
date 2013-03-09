var Post = require('../models/post.js');
var User = require('../models/user.js');
var Category = require('../models/category.js');
var Album = require('../models/album.js');
var Photo = require('../models/photo.js');
var Page = require('../models/page.js');

var fs = require('fs');
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
					Page.find({nav: "true"}, function(err,pages){
						res.render('index', {title: 'Index', docs: docs, cats: cats, pages: pages});
					});
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
	res.render('login', {title: 'Login', pages: ''});
};

exports.registerform = function(req, res){
	res.render('register', {title: 'Register', pages: ''});
};

exports.test = function(req, res){
	res.render('index', { title: req.params.test });
};

exports.postform = function(req, res){
	Category.find({}, function(err, cats){
		if (err) res.send(err);
		res.render('postform', {title: 'Form', cats: cats, pages: ''});
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
			res.render('viewpost', {title: 'View', post: doc, pages: ''});
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
				res.render('index', {title: req.params.cat, docs: docs, cats: cats, pages: ''});
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
				res.render('updateform', {title: 'Update', post: doc, cats: cats, pages: ''});
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
		res.render('viewalbums', {title: 'Albums', albums: albums, pages: ''});
	});
};

exports.addalbumform = function(req, res){
	res.render('addalbumform', {title: 'Add Album', pages: ''});
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
		Photo.find({album: album.id}, function(err,photos){
			if (err) res.send(err);
			console.log(photos);
			res.render('viewalbum', {title: album.name, album: album, photos: photos, pages: ''});
		});
		
	});
};

exports.addphotoform = function(req, res){
	Album.findOne({_id: req.params.id}, function(err,album){
		if (err) res.send(err);
		res.render('addphotoform', {title: "Add Photo", album: album, pages: ''});
	});
};

exports.addphoto = function(req, res){
	var tmp_path = req.files.photofile.path;
	var target_path = __dirname + '/../public/uploads/' + req.files.photofile.name;
	console.log(req.files);
	fs.readFile(tmp_path, function(err, data){
		if (err) res.send(err);
		console.log(data);
		fs.writeFile(target_path, data, function(err){
			if (err) res.send(err);
			console.log(target_path);
			var photo = {
				name: req.body.photoname,
				file: '/uploads/' + req.files.photofile.name,
				album: req.body.photoalbum
			};
			fs.unlink(tmp_path, function(){
				if (err) res.send(err);
				console.log('successfully unlinked');
			});
			Photo.create(photo, function(err,photo){
				if (err) res.send(err);
				console.log(photo);
				res.redirect('/gallery/albums/' + req.body.photoalbum);
			});
		});
	});
};

exports.addpageform = function(req, res){
	res.render('addpageform', {title: "Add Page", pages: ''});
};

exports.addpage = function(req, res){
	var page = {
		name: req.body.pagename,
		body: req.body.pagebody,
		nav: req.body.pagenav
	};
	Page.create(page, function(err, page){
		if (err) res.send(err);
		console.log(page);
		res.redirect('/');
	});
};
