var server = require('http').createServer();
var url = require('url');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server: server });
var express = require('express');
var app = express();
var port = 4080;


app.use(express.static(__dirname + '/public'));

// app.use(function (req, res) {
//   res.send({ msg: "hello" });
// });


server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });


module.exports = {
    app: app,
    wss: wss
}
