var path = require('path');
var server = require(path.join(__dirname, 'server'));
var Worker = require(path.join(__dirname, 'worker'));
var url = require('url');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });


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

    worker.on('new', function(newDoc) {
	console.log("    NEW DEVICE DISCOVERED!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
	ws.send(JSON.stringify(newDoc));
    });
});


/** API endpoint */
server.app.post('/api', urlencodedParser, function(req, res) {
    console.log('post rec\'d');

    if (req.body) console.log(req.body);
    if (req.params) console.log(req.params);


    /* SHOW */
    if (req.body.show) {
	worker.getData(function(err, data) {
	    if (err) res.status(500).json({error: true, message: err});
	    res.status(200).json({error: false, message: "data dispatched!", devices: data});
	});
    }

    /* FIND */
    else if (req.body.find) {
	if (typeof req.body.mac === 'undefined') res.status(400).json({error: true, message: 'mac address was not received'});
	if (!/(?:[a-f0-9]{2}:){5}[a-f0-9]{2}/.test(req.body.mac)) throw new Error('mac address not valid');
	
	worker.getDevice(req.body.mac, function(err, data) {
	    if (err) res.status(500).json({error: true, message: err});
	    res.status(200).json({error: false, message: "found device!", found: data});
	});
    }

    /* ADD */
    else if (req.body.add) {
	if (typeof req.body.name === 'undefined') res.status(400).json({eror: true, message: 'name was not in request body'});
	if (typeof req.body.mac === 'undefined') res.status(400).json({error: true, message: 'mac as not in request body'});

	worker.addName(req.body.name, req.body.mac, function(err, numAdded) {
	    if (err) res.status(500).json({error: true, message: err});
	    res.status(200).json({error: false, message: 'Name added to databse', added: numAdded});
	});
    }

    /* DEFAULT */
    else {
	res.status(500).json({error: true, message: 'api command was not specified in HTTP request body'});
    }
});




