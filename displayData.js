var Datastore = require('nedb');


var dbOpts = {
    'filename': './data.nedb',
    'autoload': true
}

var db = new Datastore(dbOpts);


db.find({}, function(err, docs) {
    if (err) throw err;
    console.dir(docs);
});
