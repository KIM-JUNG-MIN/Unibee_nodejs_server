module.exports = function(connection, options, app, router) {

  var session = require('express-session');
  var MySQLStore = require('express-mysql-session')(session);
  // var bodyParser = require('body-parser'); //post방식의 데이터에 접근할 수 있게 해주는 미들웨어
  var bkfd2Password = require("pbkdf2-password");
  var passport = require('passport')
  var LocalStrategy = require('passport-local').Strategy;
  var hasher = bkfd2Password();
  var sessionStore = new MySQLStore({options}, connection);

  // app.use(bodyParser.urlencoded({ extended: false }));
  app.use(session({
    secret: 'sid',
    resave: false,
    saveUninitialized: true,
    store: sessionStore
  }))

  app.use(passport.initialize());
  app.use(passport.session());
  //session 보다 밑에 위치해야 한다!


  router.get('/register', function(req, res) {
    res.render('register_form');
  });
  //회원가입 form

  router.get('/login', function(req, res) {
    res.render('login_form');
  });
  //로그인 form

  router.post('/register', function(req, res){

    hasher({password:req.body.password}, function(err, pass, salt, hash) {
      var user = {
        authId: 'local:' + req.body.username,
        username : req.body.username,
        password : hash,
        salt : salt,
        displayName : req.body.displayName
      };

      var sql = 'INSERT INTO users SET ?';
      connection.query(sql, user , function(err, result){
        if (err) {
          console.log(err);
          res.status(500);
        } else {
          req.login(user, function(err){
            req.session.save(function(){
              res.redirect('/main');
            });
          });
        }
      });
    });
  });
  //회원가입 form에서 받은 데이터로 사용자 추가

  passport.serializeUser(function(user, done) {
    console.log("serializeUser" , user);
    done(null, user.authId);
  });
   //session 정보 처음 저장

  passport.deserializeUser(function(id, done) {
    console.log("deserializeUser" , id);
    var sql = 'SELECT * FROM users WHERE authId =?';
    connection.query(sql, [id] , function(err, results){
      if (err) {
        done('There is no user.');
      }else {
        done(null, results[0]);
      }
    });
  });
   //등록된 session 호출

  passport.use(new LocalStrategy(
    function(username, password, done){
      var uname = username;
      var pwd = password;


      var sql = 'SELECT * FROM users WHERE authId =?';
      connection.query(sql, ['local:'+uname] , function(err, results){
        if (err) {
          return done('There is no user.');
        }
        var user = results[0];
        return hasher({password:pwd, salt:user.salt}, function(err, pass, salt, hash){
          if(hash === user.password){
            console.log('LocalStrategy', user);
            done(null, user);
          } else {
            done(null, false);
          }
        });
      });
    }
  ));

  router.post('/login',
    passport.authenticate('local',
    { //successRedirect: '/welcome',
      failureRedirect: '/login',
      failureFlash: true }),
      function(req, res){
        req.session.save(function(){
          res.redirect('/main');
        });
      } //미들웨어
  );

  router.get('/logout', function(req, res) {
    req.logout();

    req.session.save(function(){
      res.redirect('/main');
    });
  });
  //로그아웃

  return router;
}
