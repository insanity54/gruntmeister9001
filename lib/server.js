var path = require('path');
var server = require('http').createServer();
var url = require('url');
var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({ server: server });
var express = require('express');
var app = express();
var port = 4080;


var staticDir = path.join(__dirname, '..', 'public');
console.log('static dir ' + staticDir);


app.use(express.static(staticDir));

// app.use(function (req, res) {
//   res.send({ msg: "hello" });
// });


server.on('request', app);
server.listen(port, function () { console.log('Listening on ' + server.address().port) });


module.exports = {
    app: app,
    wss: wss
}
