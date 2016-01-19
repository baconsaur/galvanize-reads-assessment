var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var knex = require('./db/knex');
require('dotenv').load();

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

function Books () {
	return knex('books').select('books.id', 'books.title', 'books.cover_url', 'books.description', 'genres.name as genre').innerJoin('genres', 'books.genre', 'genres.id');
}

function Authors () {
	return knex('authors').select('authors.*', 'book_author.book_id').innerJoin('book_author', 'authors.id', 'book_author.author_id');
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/books', function (req, res) {
	Books().then(function(books){
		Authors().then(function(authors){
			for (var i in books) {
				books[i].author = [];
				for (var j in authors) {
					if (books[i].id === authors[j].book_id) {
						books[i].author.push({
							id: authors[j].id,
							first_name: authors[j].first_name,
							last_name: authors[j].last_name
						});
					}
				}
			}
			res.render('books', {
				books: books
			});
		});
	});
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
