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
    'insert into todo(title, completed) values($1, $2) returning *',
    [req.body.title, false],
    function(err, result) {
      res.json(result.rows[0]);
    });
});

app.delete('/', function(req, res, next) {
  console.log('DELETE / called');
  pool.query('delete from todo', function(err, result) {
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
             'url varchar(255))');
  res.json({success: 'db setup succesfully'});
});

app.listen(3000, function() {
  console.log('app listening on port 3000');
});
