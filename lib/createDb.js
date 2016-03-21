var database = require('./database');
var fs = require('fs');
var seed = require('./config.json');




if (seed.knownDevice) {
    for (var i=0; i<seed.knownDevice.length; i++) {
	database.insert(seed.knownDevice[i], function(err, d) {
	    console.log('added '+seed.knownDevice.mac);
	});
    }
}

var exampleDoc = {
    "mac": "ae:fe:be:ef:dr:ff",
    "name": "elrond"
}

database.insert(exampleDoc, function(err, newDoc) {
    console.log(newDoc);
});
