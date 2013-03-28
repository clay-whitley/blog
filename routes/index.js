var Post = require('../models/post.js');
var User = require('../models/user.js');
var Category = require('../models/category.js');
var Album = require('../models/album.js');
var Photo = require('../models/photo.js');
var Page = require('../models/page.js');

var fs = require('fs');
var pkgcloud = require('pkgcloud');

// var amazon = pkgcloud.storage.createClient({
//   provider: 'amazon', // 'aws', 's3'
//   keyId: 'AKIAJNHU6XS2MH42D6LQ',
//   key: 'LSzXWeQLSoSaHRVfdAxfi8Cf8eLtaaVqtsliJDRk'
// });
/*
 * GET home page.
 */

exports.index = function(req, res){
	Post
	.find({})
	.sort('-date')
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
						res.render('index', {title: 'Index', docs: docs, cats: cats, pages: pages, loggedin: req.session.loggedIn});
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
	res.render('login', {title: 'Login', pages: '', loggedin: req.session.loggedIn});
};

exports.registerform = function(req, res){
	res.render('register', {title: 'Register', pages: '', loggedin: req.session.loggedIn});
};

exports.test = function(req, res){
	res.render('index', { title: req.params.test });
};

exports.postform = function(req, res){
	Category.find({}, function(err, cats){
		if (err) res.send(err);
		res.render('postform', {title: 'Form', cats: cats, pages: '', loggedin: req.session.loggedIn});
	});
};

exports.addpost = function(req, res){
			var date = new Date();
			var post = {
				title: req.body.posttitle
				, category: req.body.postcategory || req.body.postcatchoice
				, author: req.body.postauthor
				, desc: req.body.postbody.substring(0, 750)
				, date: date
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
							res.redirect('/');
						}
					});
					
				}
			});
};

exports.viewpost = function(req, res){

	Post.findOne({_id: req.params.id}, function(err, doc){
		if (err) {
			res.send(err);
		} else {
			res.render('viewpost', {title: 'View', post: doc, pages: '', loggedin: req.session.loggedIn});
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
				res.render('index', {title: req.params.cat, docs: docs, cats: cats, pages: '', loggedin: req.session.loggedIn});
			});
			
		}
	});
};

exports.updateform = function(req, res){
	Post.findOne({_id: req.params.id}, function(err, doc){
		if (err) {
			res.send(err);
		} else {
			Category.find({}, function(err,cats){
				if (err) res.send(err);
				res.render('updateform', {title: 'Update', post: doc, cats: cats, pages: '', loggedin: req.session.loggedIn});
			});
		}
	});
};

exports.updatepost = function(req, res){
	var post = {
		title: req.body.posttitle
		, category: req.body.postcategory || req.body.postcatchoice
		, desc: req.body.postdesc
		, body: req.body.postbody
	};
	Post.update({_id: req.params.id}, post, function(err){
		if (err) {
			res.send(err);
		} else {
			res.redirect('/');
		}
	});
};

exports.deletepost = function(req, res){
	Post.remove({_id: req.params.id}, function(err){
		if (err) res.send(err);
		res.redirect('/');
	});
};

exports.viewalbums = function(req, res){
	Album.find({}, function(err, albums){
		if (err) res.send(err);
		res.render('viewalbums', {title: 'Albums', albums: albums, pages: '', loggedin: req.session.loggedIn});
	});
};

exports.addalbumform = function(req, res){
	res.render('addalbumform', {title: 'Add Album', pages: '', loggedin: req.session.loggedIn});
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
			res.render('viewalbum', {title: album.name, album: album, photos: photos, pages: '', loggedin: req.session.loggedIn});
		});
		
	});
};

exports.addphotoform = function(req, res){
	Album.findOne({_id: req.params.id}, function(err,album){
		if (err) res.send(err);
		res.render('addphotoform', {title: "Add Photo", album: album, pages: '', loggedin: req.session.loggedIn});
	});
};

exports.addphoto = function(req, res){
	var tmp_path = req.files.photofile.path;
	var target_path = __dirname + '/../public/uploads/' + req.files.photofile.name;
	console.log(req.files);
	fs.createReadStream(tmp_path).pipe(amazon.upload({
		container: 'claywhitley-development',
		remote: 'test.jpg'
	}, function(err){
		if (err) res.send(err);
	}));
	// fs.readFile(tmp_path, function(err, data){
	// 	if (err) res.send(err);
	// 	console.log(data);
	// 	fs.writeFile(target_path, data, function(err){
	// 		if (err) res.send(err);
	// 		console.log(target_path);
	// 		var photo = {
	// 			name: req.body.photoname,
	// 			file: '/uploads/' + req.files.photofile.name,
	// 			album: req.body.photoalbum
	// 		};
	// 		fs.unlink(tmp_path, function(){
	// 			if (err) res.send(err);
	// 			console.log('successfully unlinked');
	// 		});
	// 		Photo.create(photo, function(err,photo){
	// 			if (err) res.send(err);
	// 			console.log(photo);
	// 			res.redirect('/gallery/albums/' + req.body.photoalbum);
	// 		});
	// 	});
	// });
};

exports.addpageform = function(req, res){
	res.render('addpageform', {title: "Add Page", pages: '', loggedin: req.session.loggedIn});
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

exports.viewpage = function(req, res){
	Page.findOne({_id: req.params.id}, function(err, page){
		if (err) res.send(err);
		res.render('viewpage', {title: page.name, page: page, pages: '', loggedin: req.session.loggedIn});
	});
};