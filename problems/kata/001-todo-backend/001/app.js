var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var nano = require('nano')('http://localhost:5984');
var todo = nano.db.use('todo');
var todos = require('./todo');

var app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
  console.log('get triggered');
  var results = [];
  todo.view('todos', 'all_todos', function(err, body) {
    for (var row of body.rows) {
      results.push(row.value);
    }
    res.json(results);
  });
});

app.post('/', function(req, res, next) {
  console.log('post triggered');
  var task = {title: req.body.title, completed: false, order: req.body.order};
  todo.insert(task, function(err, body) {
    if (err) {
      console.log(err);
    }
    task._id = body.id;
    task._rev = body.rev;
    // assign a url based on id and commit back to database
    task.url = 'http://localhost:3000/' + body.id;
    todo.insert(task, function(err, body) {
      res.json(task);
    });
  });
});

app.delete('/', function(req, res, next) {
  console.log('delete triggered');
  todo.view('todos', 'all_todos', function(err, body) {
    if (body.rows.length !== 0) {
      body.rows.forEach(function(curr, index, array) {
        todo.destroy(curr.value._id, curr.value._rev, function(err, body) {
          if (index === array.length - 1) {
            res.json([]);
          }
        });
      });
    } else {
      res.json([]);
    }
  });
});

app.get('/:url', function(req, res, next) {
  todo.get(req.params.url, function(err, body) {
    console.log(body);
    res.json(body);
  });
});

app.patch('/:url', function(req, res, next) {
  todo.get(req.params.url, function(err, body) {
    if (req.body.title) {
      body.title  = req.body.title;
    }
    if (req.body.completed) {
      body.completed  = req.body.completed;
    }
    if (req.body.order) {
      body.order  = req.body.order;
    }
    todo.insert(body, function(err, update) {
      res.json(body);
    });
  });
});

app.delete('/:url', function(req, res, next) {
  todo.get(req.params.url, function(err, body) {
    todo.destroy(body._id, body._rev, function(err, body) {
      res.json([]);
    });
  });
});

app.listen(3000, function() {
  console.log('Cors enabled server listening on port 3000');
});
