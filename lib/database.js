var path = require('path');
var Datastore = require('nedb');


var dbOpts = {
    'filename': path.join(__dirname, '..', 'data.nedb'),
    'autoload': true
}

var db = new Datastore(dbOpts);



module.exports = db;
