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
