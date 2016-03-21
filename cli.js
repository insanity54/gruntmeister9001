var path = require('path');
var minimist = require('minimist');
var request = require('request');
// var addName = require(path.join(__dirname, 'lib', 'addName'));
var displayData = require(path.join(__dirname, 'lib', 'displayData'));
// var findOne = require(path.join(__dirname, 'lib', 'findOne'));

var apiHost = '127.0.0.1';
var apiPort = '4080';
var apiUsername = 'rolotony';
var apiPassword = 'h4xxme';


var argv = minimist(process.argv.slice(2));

//console.log(argv);

if (typeof argv._[0] === 'undefined') usage();
if (argv._[0] === 'usage') usage();
if (argv.usage) usage();
if (argv.h) usage();
if (argv.help) usage();


// set api info if supplied
if (argv.host) apiHost = argv.host;
if (argv.port) apiPort = argv.port;
if (argv.username) apiUsername = argv.username;
if (argv.password) apiPassword = argv.password;
var apiEndpoint = 'http://'+apiHost+':'+apiPort+'/api';



if (argv._[0] === 'add') {

    if (typeof argv._[1] === 'undefined' || typeof argv._[2] === 'undefined') usage();
    console.log('adding '+argv._[1]+' to '+argv._[2]);

    
    request.post({
	'auth': {
	    'user': apiUsername,
	    'pass': apiPassword,
	    'sendImmediately': false
	},
	'url': apiEndpoint,
	'form': {
	    'add': true,
	    'name': argv_[1],
	    'mac': argv_[2]
	}
    }, function(err, httpResponse, body) {
	if (err) throw err;
	if (httpResponse.statusCode !== 200) {
	    throw new Error('did not receive HTTP code 200 from api server. got instead '+httpResponse.statusCode);
	}

	if (!body) throw new Error('no body received from API call');
	if (!body.devices) throw new Error('no device list received from API call');
	//displayData(body.devices);
    });
		 
}

else if (argv._[0] === 'show') {

    request.post({
	'auth': {
	    'user': apiUsername,
	    'pass': apiPassword,
	    'sendImmediately': false
	},
	'url': apiEndpoint,	
	'form': {
	    'show': true
	}
    }, function(err, httpResponse, body) {
	if (err) throw err;
	if (httpResponse.statusCode !== 200) {
	    throw new Error('did not receive HTTP code 200 from api server. got instead ');
	}

	body = JSON.parse(body);
	if (!body) throw new Error('no body received from API call');
	if (!body.devices) throw new Error('no device list received from API call');	
	displayData(body.devices);
    });

}


else if (argv._[0] === 'find') {
    
    if (typeof argv._[1] === 'undefined') throw new Error('find requires an argument, the mac address you want to find.');
    
    request.post({
	'auth': {
	    'user': apiUsername,
	    'pass': apiPassword,
	    'sendImmediately': false
	},
	'url': apiEndpoint,
	'form': {
	    'find': true,
	    'mac': argv._[1]
	}
    }, function(err, httpResponse, body) {
	if (err) throw err;
	if (httpResponse.statusCode !== 200) {
	    throw new Error('did not receive HTTP code 200 from api server. got instead '+httpResponse.status);
	}
	
	console.log(body);
    });
}


else {
    usage();
}



function usage() {
    console.log('MAC TRACKER');
    console.log('USAGE: ');
    console.log('  $ cli add [NAME] [MAC]');
    console.log('  $ cli find [MAC]');    
    console.log('  $ cli show');
    console.log('');
    console.log('EXAMPLES: ');
    console.log('Add friendly name "pete" to device with mac address 00:3b:ff:34:02:ab');
    console.log('  $ cli add pete 00:3b:ff:34:02:ab');
    console.log('');
    console.log('Find device with mac 00:3b:ff:34:02:ab');
    console.log('  $ cli find 00:3b:ff:34:02:ab');
    console.log('');
    console.log('Show all devices in the database');
    console.log('  $ cli show');
    console.log('');    
    process.exit();
}
