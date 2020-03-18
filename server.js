var express = require('express');
var app = express();
var path = require('path');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var connection = mysql.createConnection({
	host     : 'us-cdbr-iron-east-04.cleardb.net',
	user     : 'bda98a86a56861',
	password : '0ac4df32',
	database : 'heroku_15946f295931605'
    });

connection.connect();
global.db = connection;

app.use(bodyParser.urlencoded({ extended: false }));
const cookieParser = require('cookie-parser');
app.use(cookieParser())
var port = process.env.PORT || 8080;
// parse application/json
app.use(bodyParser.json());

const routes = require('./routes/routes.js')(app,fs);

app.engine('hbs', hbs({extname: 'hbs', defaultLayout: 'default', layoutsDir: __dirname + '/views/layouts/'}));

app.set('view engine', 'hbs');


const dataRoutes = require('./routes/data');

var fs = require('fs');

app.use(express.static(path.join(__dirname, 'public')));


var server=app.listen(port,function() {
	console.log("app running on port 8080"); });

