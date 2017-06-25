var express = require('express');
var bodyParser = require('body-parser');
var morgan = require('morgan');
var config = require('./config');
var mongoose = require('mongoose');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

mongoose.connect(config.localdb, function (err) {
  if (err) {
    console.log(err);
  } else {
    console.log('Ok with connection!');
  }
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));



var api = require('./app/routes/api')(app,express,io);

app.use('/api',api);
app.use(express.static(__dirname+'/public'));

app.get('*',function (req, res) {
  res.sendFile(__dirname+'/public/app/views/index.html');
});

http.listen(config.port, function (err) {
  if(err){
    console.log(err);
  }
  else {
    console.log("Listening on a port 3000");
  }
});
