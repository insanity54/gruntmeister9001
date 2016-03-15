var Datastore = require('nedb');
var fs = require('fs');
var seed = require('./config.json');



var opts = {
    'filename': './data.nedb',
    'autoload': true
}
var db = new Datastore(opts);


if (seed.knownDevice) {
    for (var i=0; i<seed.knownDevice.length; i++) {
	db.insert(seed.knownDevice[i], function(err, d) {
	    console.log('added '+seed.knownDevice.mac);
	});
    }
}

var exampleDoc = {
    "mac": "ae:fe:be:ef:dr:ff",
    "name": "elrond"
}

db.insert(exampleDoc, function(err, newDoc) {
    console.log(newDoc);
});
