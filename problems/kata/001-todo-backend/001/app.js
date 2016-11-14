var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var nano = require('nano')('http://localhost:8984');
var todo = nano.db.use('todo');

var app = express();

app.use(cors());
app.use(bodyParser.json());

app.get('/', function(req, res, next) {
  console.log('get triggered');
  res.json([]);
});

app.post('/', function(req, res, next) {
  console.log('post triggered');
  var task = {title: req.body.title};
  res.json(task);
});

app.listen(3000, function() {
  console.log('Cors enabled server listening on port 3000');
});
