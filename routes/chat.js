module.exports = function(connection, app, router) {

  router.get('/', function(req, res) {
    res.render('chat_member');
  });
  //멤버리스트 form

  router.get('/memberlist', function(req, res){

    var sql = 'SELECT displayName FROM users';
    connection.query(sql, function(err, results){
      if (err) {
        console.log(err);
        res.status(500);
      } else {
        res.json(results);
      }
    });
  });

  return router;
}
