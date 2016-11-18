var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var todos = require('./todo');

var app = express();

app.set('port', process.env.PORT || 3000);
app.use(cors());
app.use(bodyParser.json());

// TODO: abstract callback used in all routers

app.get('/', function(req, res, next) {
  todos.getAll(function(err, results) {
    console.log('Calling getAll from get /');
    if (err) {
      res.stats(500);
      res.json({error: 'error retrieving tasks'});
    } else {
      res.json(results);
    }
  });
});

app.post('/', function(req, res, next) {
  var task = {title: req.body.title, completed: false, order: req.body.order};
  todos.addTask(task, function(err, result) {
    console.log('adding task from POST /');
    if (err) {
      res.status(500);
      res.json({error: 'failed to create task'});
    } else {
      res.json(result);
    }
  });
});

app.delete('/', function(req, res, next) {
  todos.deleteAll(function(err, result) {
    console.log('delete all tasks from DELETE /');
    if (err) {
      res.status(500);
      res.json({error: 'error deleting all tasks'});
    } else {
      res.json(result);
    }
  });
});

app.get('/:url', function(req, res, next) {
  var url = req.params.url;
  todos.getTask(url, function(err, result) {
    console.log('getting task from GET /' + url);
    if (err) {
      res.status(500);
      res.json({error: 'failed to get task'});
    } else {
      res.json(result);
    }
  });
});

app.patch('/:url', function(req, res, next) {
  todos.updateTask(req.params.url, req.body, function(err, result) {
    console.log('updating task from PATH /' + req.params.url);
    if (err) {
      req.status(500);
      req.response({error: 'couldn\'t update task'});
    } else {
      res.json(result);
    }
  });
});

app.delete('/:url', function(req, res, next) {
  todos.deleteTask(req.params.url, function(err, result) {
    console.log('deleting task from PATH /' + req.params.url);
    if (err) {
      req.status(500);
      req.response({error: 'couldn\'t delete task'});
    } else {
      res.json(result);
    }
  });
});

app.listen(app.get('port'), function() {
  console.log('Cors enabled server listening on port ' + app.get('port'));
});
