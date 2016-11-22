var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var Pool = require('pg').Pool;
var pool = new Pool({
  database: 'todo',
  max: 10,
  idelTimeoutMillis: 1000
});

var app = express();
app.use(cors());
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
  console.log('GET / called');
  pool.query(
    'select * from todo',
    function(err, result) {
      res.json(result.rows);
    });
});

app.post('/', function(req, res, next) {
  console.log('POST / called');
  pool.query(
    'insert into todo(title, completed, "order") values($1, $2, $3) returning *',
    [req.body.title, false, req.body.order],
    function(err, result) {
      var id = result.rows[0].id;
      pool.query(
        'update todo set url=$1 where id=$2 returning *',
        ['http://localhost:3000/' + id, id],
        function(err, result) {
          res.json(result.rows[0]);
        });
    });
});

app.delete('/', function(req, res, next) {
  console.log('DELETE / called');
  pool.query('delete from todo', function(err, result) {
    res.json([]);
  });
});

app.get('/:url', function(req, res, next) {
  console.log('GET /' + req.params.url);
  pool.query(
    'select * from todo where id=$1',
    [req.params.url],
    function(err, result) {
      res.json(result.rows[0]);
    });
});

app.patch('/:url', function(req, res, next) {
  console.log('PATCH /' + req.params.url);
  pool.query(
    'select * from todo where id = $1',
    [req.params.url],
    function(err, result) {
      var todo = result.rows[0];
      var title = req.body.title || todo.title;
      var completed = req.body.completed || todo.completed;
      var order = req.body.order || todo.order
      pool.query(
        'update todo set title=$1, completed=$2, "order"=$3 where id=$4 returning *',
        [title, completed, order, todo.id],
        function(err, result) {
          res.json(result.rows[0]);
        });
    });
});

app.delete('/:url', function(req, res, next) {
  console.log('DELETE /' + req.params.url);
  pool.query(
    'delete from todo where id=$1',
    [req.params.url],
    function(err, result) {
      res.json([]);
    });
});

app.post('/setup/db', function(req, res, next) {
  console.log('POST /setup/db');
  pool.query('drop table todo');
  pool.query('create table todo ' +
             '(id serial, ' +
             'title varchar(100),' +
             'completed boolean,' +
             'url varchar(255),' +
             '"order" integer)');
  res.json({success: 'db setup succesfully'});
});

app.listen(3000, function() {
  console.log('app listening on port 3000');
});
