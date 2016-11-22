var express = require('express');

var cors = require('cors');
var app = express();
app.use(cors());

app.get('/', function(req, res, next) {
  console.log('GET / called');
  res.json([]);
});

app.post('/', function(req, res, next) {
  console.log('POST / called');
  res.json([]);
});

app.listen(3000, function() {
  console.log('app listening on port 3000');
});
