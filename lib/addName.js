
var database = require('./database');





function update(name, mac, cb) {
    if (typeof name === 'undefined' || typeof mac === 'undefined') throw new Error('arg0 name and arg1 mac must be defined');
    if (typeof cb === 'undefined') throw new Error('arg3 callback must be defined');
    mac = mac.toLowerCase();
    if (!/(?:[a-f0-9]{2}:){5}[a-f0-9]{2}/.test(mac)) throw new Error('mac address not valid');

    database.update({mac: mac}, {$set: {"name": name}}, {}, function(err, numAffected, affectedDocs) {
	if (err) return cb(err, null);
	if (numAffected === 0) return cb(new Error('no matching documents to update'), null);
	if (typeof affectedDocs === 'undefined') return cb(new Error('no docs were affected'), null);
	console.log(affectedDocs+' affected docs');
	return cb(null, numAffected, affectedDocs);
    });
}


module.exports = update;



