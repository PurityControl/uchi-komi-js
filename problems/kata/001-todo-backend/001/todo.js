module.exports = function(dbUrl, hostUrl) {
  var nano = require('nano')(dbUrl);
  var db = nano.db.use('todo');
  var _ = require('lodash');

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
        task.url = hostUrl + '/' + body.id;
        db.insert(task, function(err, body) {
          callback(err, task);
        });
      }
    });
  };

  todo.deleteAll = function(callback) {
    db.view('todos', 'all_todos', function(err, body) {
      if (body.rows.length !== 0) {
        body.rows.forEach(function(curr, index, array) {
          db.destroy(curr.value._id, curr.value._rev, function(err, body) {
            if (index === array.length - 1) {
              callback(err, []);
            }
          });
        });
      } else {
        callback(err, []);
      }
    });
  };

  todo.getTask = function(url, callback) {
    db.get(url, function(err, body) {
      callback(err, body);
    });
  };

  todo.updateTask = function(url, updates, callback) {
    this.getTask(url, function(err, task) {
      _.assign(task, updates);
      db.insert(task, function(err , updated) {
        callback(err, task);
      });
    });
  };

  todo.deleteTask = function(url, callback) {
    this.getTask(url, function(err, task) {
      db.destroy(task._id, task._rev, function(err, body) {
        callback(err, []);
      });
    });
  };

  return todo;
};
