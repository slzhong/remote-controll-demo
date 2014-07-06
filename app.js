var fs = require('fs')
  , url = require('url')
  , http = require('http')
  , io = require('socket.io');

var port = Number(process.env.PORT || 3000);

var app = http.createServer(function (req, res) {
  var path = (url.parse(req.url).pathname == '/') 
    ? '/views/game.html' 
    : url.parse(req.url).pathname;
  var mime = path.split('.').pop();
  if (mime == 'js') {
    mime = 'text/javascript';
  } else if (mime == 'jpg' || mime == 'png') {
    mime = 'image/' + mime;
  } else {
    mime = 'text/' + mime;
  }
  fs.readFile('.' + path, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end();
    } else {
      res.writeHead(200, {"Content-Type": mime});
      res.end(data);
    }
  });
}).listen(port);

io.listen(app, {log : false}).sockets.on('connection', function (socket) {

  socket.on('move', function (data) {
    socket.broadcast.emit('move', data);
  });

  socket.on('explode', function () {
    socket.broadcast.emit('explode');
  });

});

console.log('server listening on port ' + port);