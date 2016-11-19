var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');

var app = express();

// FIXME: move this into a helper module
app.set('port', process.env.PORT || 3000);
app.set('host', process.env.HOST || 'http://localhost');
app.set('host_url', app.get('host') + ':' + app.get('port'));
app.set('db_host', process.env.DB_HOST || 'http://localhost');
app.set('db_port', process.env.DB_PORT || 5984);
app.set('db_host_url', app.get('db_host') + ':' + app.get('db_port'));
var todos = require('./todo')(app.get('db_host_url'), app.get('host_url'));
app.use(cors());
app.use(bodyParser.json());

// TODO: abstract callback used in all routers

function genResponse(res, mymap) {
  return function(err, results) {
    if (mymap.consoleMessage) {
      console.log(mymap.consoleMessage);
    }
    if (err) {
      res.status(mymap.errorStatus || 500);
      res.json({error: mymap.errorMessage || 'error'});
    } else {
      res.json(results);
    }
  };
}

app.get('/', function(req, res, next) {
  todos.getAll(genResponse(res, {
    consoleMessage: 'Calling getAll from get /',
    errorStatus: 500,
    errorMessage: 'error retrieving tasks'
  }));
});

app.post('/', function(req, res, next) {
  var task = {title: req.body.title, completed: false, order: req.body.order};
  todos.addTask(task, genResponse(res, {
    consoleMessage: 'Calling addTask from post /',
    errorStatus: 500,
    errorMessage: 'failed to create task'
  }));
});

app.delete('/', function(req, res, next) {
  todos.deleteAll(genResponse(res, {
    consoleMessage: 'delete all tasks from DELETE /',
    errorStatus: 500,
    errorMessage: 'error deleting all tasks'
  }));
});

app.get('/:url', function(req, res, next) {
  var url = req.params.url;
  todos.getTask(url, genResponse(res, {
    consoleMessage: 'getting task from GET /' + url,
    errorStatus: 500,
    errorMessage: 'failed to get task'
  }));
});

app.patch('/:url', function(req, res, next) {
  todos.updateTask(req.params.url, req.body, genResponse(res, {
    consoleMessage: 'updating task from PATH /' + req.params.url,
    errorStatus: 500,
    errorMessage: 'couldn\'t update task'
  }));
});

app.delete('/:url', function(req, res, next) {
  todos.deleteTask(req.params.url, genResponse(res, {
    consoleMessage: 'deleting task from PATH /' + req.params.url,
    errorStatus: 500,
    errorMessage: 'couldn\'t delete task'
  }));
});

app.listen(app.get('port'), function() {
  console.log('Cors enabled server listening on port ' + app.get('port'));
});
