var express 	= require('express'), 
	request 	= require('request'), 
	Client 		= require('node-rest-client').Client, 
	querystring = require('querystring'), 
	FormData 	= require('form-data'), 
	http 		= require('http');

var router = module.exports = express.Router({mergeParams: true});
	router.url = '/account';

	router.all("/*", function(req, res, next) {
		if(!req.session.user) res.redirect('/');
		next();
	});

	router.get('/', function(req, res) {
		res.render('DetailAccount', {
			user : req.session.user
		});
	});

	router.post('/update', function(req, res) {
		var data = {};

		req.pipe(req.busboy);
		req.busboy.on('field', function(key, val, keyTruncated, valueTruncated) {
			if(val || val != "") data[key] = val;
		});

		req.busboy.on('finish', function() {
			var client = new Client();
			client.post(req.app.get('api-host') + "/api/user/" + req.session.user.userId + "/edit", {
				data: querystring.stringify(data),
				headers: {"Content-Type": "application/x-www-form-urlencoded"} 
			}, function(data, response) {
				if(data && data.success) {
					req.session.user = data.result;
				} 

				res.redirect('/my/account');
			});
		});
	});

	router.get('/thumb', function(req, res) {
		request(req.app.get('api-host') + "/api/user/" + req.session.user.userId + "/thumb").pipe(res);
	});

	router.post('/thumb/update', function(req, res) {
		var apiUrl = url.parse(req.app.get('api-host'));
		
		req.pipe(req.busboy);
		req.busboy.on('file', function (fieldname, file, filename) {
			var form = new FormData();
			form.append(fieldname, file, {filename: filename});
			
			var request = http.request({
				method: 'POST',
				host: apiUrl.hostname,
				port: apiUrl.port ? apiUrl.port : '80',
				path: '/api/user/' + req.session.user.userId + '/thumb/update',
				headers: form.getHeaders()
			}, function(resp) {
				resp.pipe(res)
			});

			form.pipe(request);
		});
	});

