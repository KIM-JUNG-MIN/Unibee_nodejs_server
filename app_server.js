var express = require('express');
var bodyParser = require('body-parser'); //post방식의 데이터에 접근할 수 있게 해주는 미들웨어
var router = express.Router();
var auth = require('./routes/auth');
var chat = require('./routes/chat');
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

app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(__dirname + '/public'));
app.use('/libs', express.static(__dirname + '/bower_components'));
app.use('/chat', chat(connection, app, router));
app.use('/auth', auth(connection, options, app, router));
app.set('views', './views'); //템플릿 엔진 위치
app.set('view engine', 'jade'); //템플릿 엔진 지정

app.get('/room', function(req, res){
  res.render('chat_form');
});

app.get('/list', function(req, res){
  res.render('chat_member');
});


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
