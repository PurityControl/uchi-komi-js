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
