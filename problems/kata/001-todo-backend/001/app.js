var express = require('express');

var app = express();

app.get('/', function(req, res, next) {
  console.log('get triggered');
  res.json([]);
});

app.listen(3000, function() {
  console.log('app listening on port 3000');
});
