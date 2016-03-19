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
Worker.prototype.parse = function parse(output, cb) {
    var self = this;

    var machines = [];
    var results;
    while ((results = parser.exec(output)) !== null) {
	var machine = {};
	machine["ip"] = results[1];
	machine["mac"] = results[2];
	machine["count"] = results[3];
	machine["length"] = results[4];
	machine["vendor"] = results[5];
	machine["idk"] = results[6];

	db.update({ "mac": machine["mac"] }, machine, { upsert: true }, function(err, numAffected, doc, upsert) {
	    if (err) throw err;
	    if (upsert) {
		self.emit('new', doc);
	    }
	});
    }

    self.emit('parsed');
    return cb(null);
}


Worker.prototype.getData = function getData(cb) {
    var self = this;

    db.find({}, function(err, docs) {
	return cb(null, docs);
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
	self.parse(data, function(err, d) {
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
