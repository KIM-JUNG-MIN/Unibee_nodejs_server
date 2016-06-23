var express = require('express');
var bodyParser = require('body-parser'); //post방식의 데이터에 접근할 수 있게 해주는 미들웨어
var router = express.Router();
var path = require('path');
var auth = require('./routes/auth');
var chat = require('./routes/chat');
var app = express();
var http = require('http').Server(app);
var mysql = require('mysql');

global.io = require('socket.io')(http);
global.root = path.resolve('../');

require('./routes/chat-socket');


var options = {
  host:'fgdbinstance.cmclvpcsh0vw.ap-northeast-1.rds.amazonaws.com',
  port:'3306',
  user:'ikbee',
  password:'dkffkqb77',
  database : 'FG_DB'
};

var connection = mysql.createConnection(options);

app.set('port', process.env.PORT || 9000);
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(__dirname + '/public'));
app.use('/libs', express.static(__dirname + '/bower_components'));
app.use('/chat', chat(connection, app, router));
app.use('/auth', auth(connection, options, app, router));
app.set('views', './views'); //템플릿 엔진 위치
app.set('view engine', 'jade'); //템플릿 엔진 지정

app.get('/main', function(req, res){

  if(req.user && req.user.displayName) {
    res.render('dashboard', {displayName:req.user.displayName, username: req.user.username});
  } else {
    res.render('home');
  }
});
//홈 화면

io.sockets.on('connection', function (socket) {

    console.log("socket connection start !!!!!!!");
  // A User starts a path
  socket.on( 'startPath', function( data, sessionId ) {
    console.log("start path !!!!!!!");
    socket.broadcast.emit( 'startPath', data, sessionId );
  });

  // A User continues a path
  socket.on( 'continuePath', function( data, sessionId ) {
    socket.broadcast.emit( 'continuePath', data, sessionId );
  });

  // A user ends a path
  socket.on( 'endPath', function( data, sessionId ) {
    socket.broadcast.emit( 'endPath', data, sessionId );
  });

});


http.listen(app.get('port'), function()
{
	console.log('Unibee server listening on port', app.get('port'));
});
