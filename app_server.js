var express = require('express');
var router = express.Router();
var auth = require('./routes/auth');
var app = express();
var mysql = require('mysql');

var options = {
  host:'fgdbinstance.cmclvpcsh0vw.ap-northeast-1.rds.amazonaws.com',
  port:'3306',
  user:'ikbee',
  password:'dkffkqb77',
  database : 'FG_DB'
};

var connection = mysql.createConnection(options);

app.use('/public', express.static(__dirname + '/public'));
app.use('/auth', auth(connection, options, app, router));
app.set('views', './views'); //템플릿 엔진 위치
app.set('view engine', 'jade'); //템플릿 엔진 지정

app.get('/main', function(req, res){

  if(req.user && req.user.displayName) {
    res.render('dashboard', {displayName:req.user.displayName});
  } else {
    res.render('home');
  }
});
//홈 화면

app.listen(9000, function(req, res){ //포트 리스닝
  console.log("this is aws 9000 port server");
})
