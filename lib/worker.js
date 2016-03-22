var fs = require('fs');
var net = require('net');
var Chance = require('chance');
var database = require('./database');
var async = require('async');
var EventEmitter = require('events').EventEmitter;
var util = require('util');



var chance = new Chance();



var parser = /((?:[0-9]{1,3}\.){3}[0-9]{1,3})\s*((?:[a-f0-9]{2}:){5}[a-f0-9]{2})\s*([0-9]{2})\s*([0-9]{1,4})\s*((?:\S*\s){1,2})/g;


/* gen a random word */
function rando() {
    return chance.word();
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
	machines.push(machine);

	database.update({
	    mac: machine.mac
	}, {
	    $set: {
		ip: machine.ip,
		mac: machine.mac,
		count: machine.count,
		length: machine.length,
		vendor: machine.vendor
           }
	}, {
	    upsert: true
	}, function(err, numAffected, doc, upsert) {
	    
	    if (err) throw err;
	    if (numAffected < 1) throw new Error('could not upsert %s', machine.mac);
	    if (upsert) {
		self.emit('new', doc);
	    }
	});
    }

    self.emit('parsed', machines);
    return cb(null, machines);
}


Worker.prototype.getData = function getData(cb) {
    if (typeof cb === 'undefined') throw new Error('second param of getMac() must be a callback');    
    var self = this;

    database.find({}, function(err, docs) {
	if (err) throw err;
	return cb(null, docs);
    });
}

Worker.prototype.getDevice = function getDevice(mac, cb) {
    if (typeof cb === 'undefined') throw new Error('second param of getMac() must be a callback');
    if (typeof mac === 'undefined') throw new Error('first param of getMac() must be a mac address');
    if (!/(?:[a-f0-9]{2}:){5}[a-f0-9]{2}/.test(mac)) throw new Error('mac address not valid');

    var self = this;

    database.findOne({mac: mac}, function(err, doc) {
	if (err) throw err;
	return cb(null, doc);
    });
}

Worker.prototype.addName = function addName(name, mac, cb) {
    if (typeof cb === 'undefined') throw new Error('third param of getMac() must be a callback');
    if (typeof mac === 'undefined') throw new Error('second param of getMac() must be a mac address');
    if (typeof mac === 'undefined') throw new Error('first param of getMac() must be a name');
    if (!/(?:[a-f0-9]{2}:){5}[a-f0-9]{2}/.test(mac)) throw new Error('mac address not valid');

    var self = this;

    database.update({mac: mac}, {$set: {name: name}}, {}, function(err, numAffected, affectedDocs) {

        if (err) return cb(err, null);
        if (numAffected === 0) return cb(new Error('no matching documents to update'), null);

        //console.log('numAffected: %s\naffectedDocs %s', numAffected, affectedDocs);
        return cb(null, numAffected, affectedDocs);
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
	    
	    // self.friendlify(d, function(err, f) {
	    // 	if (err) throw err;
	    // });
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
