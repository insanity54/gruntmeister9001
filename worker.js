var fs = require('fs');
var net = require('net');
var Chance = require('chance');
var Datastore = require('nedb');
var async = require('async');
var EventEmitter = require('events').EventEmitter;
var util = require('util');



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

    var machines = [];
    var results;
    while ((results = parser.exec(this.output)) !== null) {
	var machine = {};
	machine["ip"] = results[1];
	machine["mac"] = results[2];
	machine["count"] = results[3];
	machine["length"] = results[4];
	machine["vendor"] = results[5];
	machine["idk"] = results[6];

	db.update({ "mac": machine["mac"] }, machine, { upsert: true }, function(err, numAffected, docs) {
	    if (err) throw err;
	});
    }
    return cb(null);
}


/* add friendly name if mac is known */
function friendlify(cb) {

    //console.log('friendly');
    //console.log(this.parsed.length);

    console.log(this.parsed);
    
    var pCounter = 0;
    var pMax = this.parsed.length;
    console.log('pmax '+pMax);
    for (var i=0; i<this.parsed.length; i++) { // machines
	//console.log(this.parsed[i].mac);
	var num = i;
	db.findOne({ mac: this.parsed[num].mac }, function(err, doc) {
	    if (err) throw err;
	    if (doc) {
		console.log('doc found');
		console.log(doc);
		this.parsed[num]["name"] = doc.name;
	    }
	    
	    // increment, and exit if this is last processed
	    pCounter ++;
	    if (pCounter == pMax) {
		console.log('max');
		return cb(null);
	    }
	});
    }
}




/** control flow for when data is received from netdiscover */
function process(data, cb) {
    var context = {
	output: data.toString(),
	parsed: null
    };

    //console.log('>> '+context.output);
    
    async.series([
	parseOutput.bind(context),
	//friendlify.bind(context)
    ], function(err, d) {
	if (err) throw err;
	//console.log('process complete');
	cb(null, d);
    });
}





/**
   Worker
     * listens to netdiscover
     * adds netdiscover information to database
     * extends EventEmitter.
       * events
         * message
	 * error
	 * end
*/
function Worker() {

    var self = this;


    /** establish network connection to the netdiscover socket */
    var n = net.connect(7777, 'localhost');
    
    /** as data comes in from netdiscover, update the database */
    n.on('data', function(data) {
	console.log('>>>> got data from netdisco >>>> ' + rando());
	self.emit('message', data);	
	process(data, function(err, d) {
	    if (err) throw err;
	});
    });
    
    n.on('error', function(e) {
	self.emit('error', e);
	throw e
    });
    
    n.on('end', function() {
	console.log('stream end');
	self.emit('end');
    });
}
util.inherits(Worker, EventEmitter);




module.exports = Worker;
