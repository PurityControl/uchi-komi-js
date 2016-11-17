// FIXME: don't use hardcoded params
var nano = require('nano')('http://localhost:5984');
var db = nano.db.use('todo');

var todo = {};

todo.getAll = function(callback) {
  var results = [];
  db.view('todos', 'all_todos', function(err, body) {
    for (var row of body.rows) {
      results.push(row.value);
    }
    callback(err, results);
  });
};

todo.addTask = function(task, callback) {
  db.insert(task, function(err, body) {
    if (err) {
      callback(err);
    } else {
      task._id = body.id;
      task._rev  = body.rev;
      // assign a url based on id and commit back to database
      // FIXME: don't use hardcoded params
      task.url = 'http://localhost:3000/' + body.id;
      todo.insert(task, function(err, body) {
        if (err) {
          callback(err);
        } else {
          callback(nil, task);
        }
      });
    }
  });
};

module.exports = todo;
