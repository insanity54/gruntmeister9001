var database = require('./database');
var Table = require('cli-table');

function display() {
    database.find({}, function(err, docs) {
	if (err) throw err;
	
	var table = new Table({
	    head: ['IP', 'MAC', 'COUNT', 'LENGTH', 'VENDOR', 'NAME'],
	    colWidths: [17, 20, 8, 8, 20, 20]
	});
	
	for (var i=0; i<docs.length; i++) {

	    if (typeof docs[i].ip === 'undefined') docs[i].ip = 'undefined';
	    if (typeof docs[i].mac === 'undefined') docs[i].mac = 'undefined';
	    if (typeof docs[i].count === 'undefined') docs[i].count = 'undefined';
	    if (typeof docs[i].length === 'undefined') docs[i].length = 'undefined';
	    if (typeof docs[i].vendor === 'undefined') docs[i].vendor = 'undefined';
	    if (typeof docs[i].name === 'undefined') docs[i].name = 'undefined';	    
	    
	    table.push([
		docs[i].ip,
		docs[i].mac,
		docs[i].count,
		docs[i].length,
		docs[i].vendor,
		docs[i].name
	    ]);
	}
	
	console.log(table.toString());
    });
}



module.exports = display;
