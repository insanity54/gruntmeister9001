var path = require('path');
var server = require(path.join(__dirname, 'server'));
var Worker = require(path.join(__dirname, 'worker'));
var url = require('url');


var wss = server.wss;
var worker = new Worker();


wss.on('connection', function connection(ws) {
    var location = url.parse(ws.upgradeReq.url, true);
    // you might use location.query.access_token to authenticate or share sessions
    // or ws.upgradeReq.headers.cookie (see http://stackoverflow.com/a/16395220/151312)
    
    ws.on('message', function incoming(message) {
	console.log('received message from client: %s', message);
    });
    
    // worker.on('message', function(output) {
    // 	console.log('got message from worker');
    // 	ws.send(JSON.stringify(output.toString()));
    // });

    worker.on('parsed', function() {
	worker.getData(function(err, data) {
	    ws.send(JSON.stringify(data));
	});
    });
    
});




