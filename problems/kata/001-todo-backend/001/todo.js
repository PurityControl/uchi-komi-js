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

module.exports = todo;
