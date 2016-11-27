var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var todo = require('./lib/todo');

var app = express();
app.use(cors());
app.use(bodyParser.json());

var genResponse = function(errorMessage, res) {
  return function(err, result) {
    if (err) {
      res.status = 500;
      res.json({error: errorMessage});
    } else {
      res.json(result);
    }
  };
};

app.get('/', function(req, res, next) {
  console.log('GET / called');
  todo.getAll(genResponse('could not get todos from database', res));
});

app.post('/', function(req, res, next) {
  console.log('POST / called');
  todo.create(req.body, genResponse('Could not create the todo', res));
});

app.delete('/', function(req, res, next) {
  console.log('DELETE / called');
  todo.deleteAll(genResponse('Could not delete all todo\'s', res));
});

app.get('/:url', function(req, res, next) {
  console.log('GET /' + req.params.url);
  todo.get(req.params.url, genResponse('Cannot get todo', res));
});

app.patch('/:url', function(req, res, next) {
  console.log('PATCH /' + req.params.url);
  todo.update(req.params.url, req.body, genResponse('Cannot update the todo', res));
});

app.delete('/:url', function(req, res, next) {
  console.log('DELETE /' + req.params.url);
  todo.delete(req.params.url, genResponse('cannot delete task', res));
});

app.post('/setup/db', function(req, res, next) {
  console.log('POST /setup/db');
  todo.setupDB(genResponse('could not create db schema \n', res));
});

app.listen(3000, function() {
  console.log('app listening on port 3000');
});
