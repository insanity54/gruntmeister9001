var fs = require('fs');
var net = require('net');
var nconf = require('nconf');
var Chance = require('chance');
var chance = new Chance();
nconf.file('./config.json');


var output;
var parser = /((?:[0-9]{1,3}\.){3}[0-9]{1,3})\s*((?:[a-f0-9]{2}:){5}[a-f0-9]{2})\s*([0-9]{2})\s*([0-9]{1,4})\s*((?:\S*\s){1,2})/g;


function rando() {
    return chance.word();
}


function parseOutput(output) {
    if (typeof output === 'undefined') {
	throw new Error('parseOutput() needs an output string as param');
    }

    var m = output.match(parser);
    //console.log(m[1], m[2], m[3], m[4], m[5], m[6]);

    if (typeof m === 'undefined') return
    
    console.dir(m);
    console.log(m.length);
}


var n = net.connect(7777, 'localhost');

n.on('data', function(data) {
    console.log('>>>> ' + rando());
    parseOutput(data.toString());
});

n.on('error', function(e) {
    throw e
});

n.on('end', function() {
    console.log('stream end');
});
