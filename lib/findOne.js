var database = require('./database');



function findOne(one, cb) {
    database.findOne({mac: one}, function(err, doc) {
	if (err) throw err;
	return cb(null, doc);
    });
}


module.exports = findOne;
    
