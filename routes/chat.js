
module.exports = function(connection, app, router) {

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
