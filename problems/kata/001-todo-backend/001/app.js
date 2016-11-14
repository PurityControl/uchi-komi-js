var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var nano = require('nano')('http://localhost:5984');
var todo = nano.db.use('todo');

var app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
  console.log('get triggered');
  todo.view('todos', 'all_todos', function(err, body) {
    res.json(body.rows);
  });
});

app.post('/', function(req, res, next) {
  console.log('post triggered');
  var task = {title: req.body.title};
  todo.insert(task, function(err, body) {
    if (err) {
      console.log(err);
    }
    console.log(JSON.stringify(body));
    task._id = body.id;
    task._rev = body.rev;
    res.json(task);
  });
});

app.delete('/', function(req, res, next) {
  console.log('delete triggered');
  todo.view('todos', 'all_todos', function(err, body) {
    for (var row of body.rows) {
      todo.destroy(row.value._id, row.value._rev);
    }
  });
  res.json([]);
});

app.listen(3000, function() {
  console.log('Cors enabled server listening on port 3000');
});
