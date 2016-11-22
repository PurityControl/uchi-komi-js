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
  res.json([]);
});

app.post('/', function(req, res, next) {
  console.log('POST / called');
  res.json(req.body);
});

app.delete('/', function(req, res, next) {
  console.log('DELETE / called');
  res.json([]);
});

app.post('/setup/db', function(req, res, next) {
  console.log('POST /setup/db');
  pool.query('drop table todo');
  pool.query('create table todo (id serial, title varchar(100))');
  res.json({success: 'db setup succesfully'});
});

app.listen(3000, function() {
  console.log('app listening on port 3000');
});
