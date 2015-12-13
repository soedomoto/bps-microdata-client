var path = require('path'), 
	express = require('express'), 
	favicon = require('serve-favicon'), 
	logger = require('morgan'), 
	methodOverride = require('method-override'), 
	session = require('express-session'), 
	bodyParser = require('body-parser'), 
	errorHandler = require('errorhandler'), 
	compression = require('compression'),
	Passport = require('passport'), 
	MScanner = require('ny').ModuleScanner;

var app = express();

app.use(compression());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(__dirname + '/public/assets/favicon.ico'));
app.use(logger('dev'));
app.use(methodOverride());
app.use(session({ 
	resave: true, 
	saveUninitialized: true, 
	secret: 'uwotm8' }
));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MScanner.scan(__dirname).apply(app);

var server = app.listen(8000, function () {
	var port = server.address().port;
	console.log('BPS Microdata server listening at http://localhost:%s', port);
});