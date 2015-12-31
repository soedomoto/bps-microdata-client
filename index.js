var config = {
	serverListenAddress : 'localhost', 
	serverListerPort : 443, 
	serverPrivateKey : 'cert/private.key', 
	serverCertificate : 'cert/certificate.pem', 
	microdataApiServer : 'http://10.13.103.16:8080'
}

var https = require('https'),
	fs = require('fs'), 
	path = require('path'), 
	express = require('express'), 
	favicon = require('serve-favicon'), 
	logger = require('morgan'), 
	methodOverride = require('method-override'), 
	session = require('express-session'), 
	bodyParser = require('body-parser'), 
	errorHandler = require('errorhandler'), 
	compression = require('compression'), 
	busboy = require('connect-busboy'),
	Passport = require('passport'), 
	MScanner = require('ny').ModuleScanner;

var app = express();
app.set('api-host', config.microdataApiServer);

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
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true }));
app.use(busboy());

MScanner.scan(__dirname).apply(app);

https.createServer({
	key: fs.readFileSync(config.serverPrivateKey),
	cert: fs.readFileSync(config.serverCertificate)
}, app).listen(config.serverListerPort, config.serverListenAddress, function(err) {
	console.log('BPS Microdata GUI Server listening at https://%s:%s', config.serverListenAddress, config.serverListerPort);
});