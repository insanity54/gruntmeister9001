var path = require('path');
var minimist = require('minimist');
var addName = require(path.join(__dirname, 'lib', 'addName'));
var displayData = require(path.join(__dirname, 'lib', 'displayData'));
var findOne = require(path.join(__dirname, 'lib', 'findOne'));

var argv = minimist(process.argv.slice(2));



if (typeof argv._[0] === 'undefined') usage();
if (argv._[0] === 'usage') usage();
if (argv.usage) usage();
if (argv.h) usage();
if (argv.help) usage();


if (argv._[0] === 'add') {

    if (typeof argv._[1] === 'undefined' || typeof argv._[2] === 'undefined') usage();
    console.log('adding '+argv._[1]+' to '+argv._[2]);

    addName(argv._[1], argv._[2], function(err, num, docs) {
	if (err) {
	    if (/no match/.test(err)) {
		console.error('NO MATCHING MAC ADDRESS IN DATABASE');
		
	    } else if (/no docs/.test(err)) {
		console.error('NO DOCS WERE UPDATED');
		
	    } else {
		throw err;
	    }
	}
	console.log('added '+num);
	console.log('doc affected: '+docs);
    });

}

else if (argv._[0] === 'show') {
    displayData(function(err) {
	if (err) throw err;
    });
}


else if (argv._[0] === 'find') {
    findOne(argv._[1], function(err, doc) {
	if (err) throw err;
	console.log(doc);
    });
}


else {
    usage();
}



function usage() {
    console.log('MAC TRACKER');
    console.log('USAGE: ');
    console.log('  $ cli add [NAME] [MAC]');
    console.log('  $ cli find [MAC]');    
    console.log('  $ cli show');
    console.log('');
    console.log('EXAMPLES: ');
    console.log('Add friendly name "pete" to device with mac address 00:3b:ff:34:02:ab');
    console.log('  $ cli add pete 00:3b:ff:34:02:ab');
    console.log('');
    console.log('Find device with mac 00:3b:ff:34:02:ab');
    console.log('  $ cli find 00:3b:ff:34:02:ab');
    console.log('');
    console.log('Show all devices in the database');
    console.log('  $ cli show');
    console.log('');    
    process.exit();
}
