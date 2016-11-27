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
  todo.deleteAll(function(err, result) {
    if (err) {
      res.status = 500;
      res.json({error: 'Could not delete all todo\'s'});
    } else {
      res.json(result);
    }
  });
});

app.get('/:url', function(req, res, next) {
  console.log('GET /' + req.params.url);
  todo.get(req.params.url, function(err, result) {
    if (err) {
      res.status = 500;
      res.json({error: 'Cannot get todo'});
    } else {
      res.json(result);
    }
  });
});

app.patch('/:url', function(req, res, next) {
  console.log('PATCH /' + req.params.url);
  todo.update(req.params.url, req.body, function(err, result) {
    if (err) {
      res.status = 500;
      res.json({error: 'Cannot update the todo'});
    } else {
      res.json(result);
    }
  });
});

app.delete('/:url', function(req, res, next) {
  console.log('DELETE /' + req.params.url);
  todo.delete(req.params.url, function(err, result) {
    if (err) {
      res.status = 500;
      res.json({error: 'cannot delete task'});
    } else {
      res.json(result);
    }
  });
});

app.post('/setup/db', function(req, res, next) {
  console.log('POST /setup/db');
  todo.setupDB(function(err, result) {
    if (err) {
      res.status = 500;
      res.json({error: 'could not create db schema \n' + err});
    } else {
      res.json(result);
    }
  });
});

app.listen(3000, function() {
  console.log('app listening on port 3000');
});
