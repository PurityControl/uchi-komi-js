var nano = require('nano')('http://localhost:5984');
var db = nano.db.use('todo');

var todo = {};

module.exports = todo;
