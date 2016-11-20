module.exports = function(app) {
  app.set('port', process.env.PORT || 3000);
  app.set('host', process.env.HOST || 'http://localhost');
  app.set('host_url', app.get('host') + ':' + app.get('port'));
  app.set('db_host', process.env.DB_HOST || 'http://localhost');
  app.set('db_port', process.env.DB_PORT || 5984);
  app.set('db_host_url', app.get('db_host') + ':' + app.get('db_port'));
};
