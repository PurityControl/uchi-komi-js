var Pool = require('pg').Pool;
var pool = new Pool({
  database: 'todo',
  max: 10,
  idelTimeoutMillis: 1000
});

module.exports.getAll = function(callback) {
  pool.query(
    'select * from todo',
    function(err, result) {
      callback(err, result.rows);
    });
};

module.exports.create = function(todo, callback) {
  pool.query(
    'insert into todo(title, completed, "order") values($1, $2, $3) returning *',
    [todo.title, false, todo.order],
    function(err, result) {
      // now we have an id create a url from it and save in the todo
      var id = result.rows[0].id;
      pool.query(
        'update todo set url=$1 where id=$2 returning *',
        ['http://localhost:3000/' + id, id],
        function(err, result) {
          callback(err, result.rows[0]);
        });
    });
};

module.exports.deleteAll = function(callback) {
  pool.query('delete from todo', function(err, result) {
    callback(err, []);
  });
};

module.exports.get = function(id, callback) {
    pool.query(
    'select * from todo where id=$1',
    [id],
    function(err, result) {
      callback(err, result.rows[0]);
    });
};

module.exports.update = function(id, updates, callback) {
    pool.query(
    'select * from todo where id = $1',
    [id],
    function(err, result) {
      var todo = result.rows[0];
      var title = updates.title || todo.title;
      var completed = updates.completed || todo.completed;
      var order = updates.order || todo.order
      pool.query(
        'update todo set title=$1, completed=$2, "order"=$3 where id=$4 returning *',
        [title, completed, order, todo.id],
        function(err, result) {
          callback(err, result.rows[0]);
        });
    });
};

module.exports.delete = function(id, callback) {
  pool.query(
    'delete from todo where id=$1',
    [id],
    function(err, result) {
      callback(err, []);
    });
};

module.exports.setupDB = function(callback) {
  pool.query('drop table todo', function(err, result) {
    pool.query(
      'create table todo ' +
        '(id serial, ' +
        'title varchar(100),' +
        'completed boolean,' +
        'url varchar(255),' +
        '"order" integer)',
      function(err, result) {
        if (err) {
          console.log('Error setting up db schema \n' + err);
        }
        callback(err, {success: 'db setup successfully'});
      });
  });
};
