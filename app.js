
/**
 * Module dependencies.
 */

var express = require('express')
  , mongoose = require('mongoose')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , fs = require('fs');

var app = express();

// Middleware

function secure (req, res, next) {
  if (!req.session.loggedIn) {
    return res.send(403);
  }
  next();
}

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(express.session({secret: 'secret'}));
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// Routes

app.get('/', routes.index);
app.get('/signup', routes.registerform);
app.post('/signup', routes.adduser);
app.get('/login', routes.loginform);
app.post('/login', routes.login);
app.get('/logout', routes.logout);
app.get('/blog/add', routes.postform);
app.post('/blog/add', routes.addpost);
app.get('/blog/:sn', routes.viewpost);
app.get('/blog/category/:cat', routes.viewcat);
app.get('/blog/:sn/edit', secure, routes.updateform);
app.put('/blog/:sn/update', routes.updatepost);
app.get('/gallery/albums', routes.viewalbums);
app.get('/gallery/albums/add', routes.addalbumform);
app.post('/gallery/albums/add', routes.addalbum);
app.get('/gallery/albums/:id', routes.viewalbum);
app.get('/gallery/:id/add', routes.addphotoform);
app.post('/gallery/images/add', routes.addphoto);
app.get('/:test', routes.test);
app.get('/users', user.list);

mongoose.connect('mongodb://nodejitsu:3f4438d6db932e50601c166c66c56c82@alex.mongohq.com:10057/nodejitsudb352398295620');
http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
