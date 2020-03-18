var mysql      = require('mysql');

var pool = mysql.createPool({
	host     : 'us-cdbr-iron-east-04.cleardb.net',
	user     : 'bda98a86a56861',
	password : '0ac4df32',
	database : 'heroku_15946f295931605'
    });

module.exports = pool;