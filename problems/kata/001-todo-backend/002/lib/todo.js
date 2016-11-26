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
