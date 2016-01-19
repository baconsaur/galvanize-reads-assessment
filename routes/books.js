var express = require('express');
var knex = require('../db/knex');
var router = express.Router();

function Books () {
	return knex('books').select('books.id', 'books.title', 'books.cover_url', 'books.description', 'genres.name as genre').innerJoin('genres', 'books.genre', 'genres.id');
}

function BookAuthors () {
	return knex('authors').select('authors.*', 'book_author.book_id').innerJoin('book_author', 'authors.id', 'book_author.author_id');
}

function checkGenre (genre) {
  return knex('genres').where({name: genre});
}

router.get('/', function(req, res, next) {
  Books().then(function(books){
    BookAuthors().then(function(authors){
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

router.get('/new', function (req, res, next) {
	knex('authors').then(function(authors) {
		res.render('new', {
			author: authors
		});
	});
});

router.post('/add', function (req, res, next) {
  var genre = checkGenre(req.body.genre);
  genre.then(function(genre_id) {
    if (genre_id.length > 1) {
      return genre_id;
    } else {
      return knex('genres').insert({
        name: req.body.genre
      }, 'id');
    }
  })
  .then(function(genre_id){
    return knex('books').insert({
      title: req.body.title,
      genre: genre_id[0],
      cover_url: req.body.cover_url,
      description: req.body.description
    }, 'id');
  })
  .then(function(book_id) {
    console.log(book_id);
    return knex('book_author').insert({
      book_id: book_id[0],
      author_id: req.body.authors
    }, 'id');
  })
  .then(function(results){
    console.log(results);
    res.redirect('/books');
  }).catch(function(err){
    console.log(err);
  });
});

module.exports = router;
