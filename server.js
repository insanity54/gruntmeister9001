var fs = require('fs');
var net = require('net');
var Chance = require('chance');
var Datastore = require('nedb');
var async = require('async');


var dbOpts = {
    'filename': './data.nedb',
    'autoload': true
}
var chance = new Chance();
var db = new Datastore(dbOpts);



var parser = /((?:[0-9]{1,3}\.){3}[0-9]{1,3})\s*((?:[a-f0-9]{2}:){5}[a-f0-9]{2})\s*([0-9]{2})\s*([0-9]{1,4})\s*((?:\S*\s){1,2})/g;


/* gen a random word */
function rando() {
    return chance.word();
}


/* lookup mac address in config.json */
function lookup(mac, cb) {
    var macData;
    var allData;
    allData = db.findOne({ mac: mac }, function(err, doc) {
	if (!doc) return cb(null, null);
	//console.log(doc);
	return cb(null, doc.name);
    });
}


/* parse output */
function parseOutput(cb) {
    if (typeof this.output === 'undefined')
	throw new Error('parseOutput() needs access to this.output');

    var lines = [];
    var results;
    while ((results = parser.exec(this.output)) !== null) {
	lines.push(results[0]);
    }
    return cb(null, lines);
}


/* add friendly name if mac is known */
function friendlify(cb) {
    console.log(this.output);
    
    return cb(null, null);
}


function process(data, cb) {
    var context = {
	output: data.toString()
    }
    async.series([
	parseOutput.bind(context),
	friendlify
    ], function(err, d) {
	if (err) throw err;
	cb(null, d);
    });
}


var n = net.connect(7777, 'localhost');

n.on('data', function(data) {
    console.log('>>>> ' + rando());
    process(data, function(err, d) {
	console.log(d);
    });
});

n.on('error', function(e) {
    throw e
});

n.on('end', function() {
    console.log('stream end');
});
