var express = require('express');
var app = express();
var path = require('path');
var hbs = require('express-handlebars');
var bodyParser = require('body-parser');
var mysql      = require('mysql');
var db = require('./database');
//connection.connect();
global.db = db;

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


const PORT = process.env.PORT || 8080;
app.listen(PORT,() => {
	console.log(`server is running on port ${PORT}.`); });

