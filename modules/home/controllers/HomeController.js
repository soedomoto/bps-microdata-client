var express = require('express'), 
	request 	= require('request'), 
	http 		= require('http'), 
	Client = require('node-rest-client').Client, 
	querystring = require('querystring');

var router = module.exports = express.Router({mergeParams: true});
	router.url = '/';

	router.get('/', function(req, res) {
		res.render('HomeIndex', {
			app : req.app
		});
	});

	router.get('/register', function(req, res) {
		res.render('SignUp');
	});

	router.get('/logout', function(req, res) {
		if(req.session) req.session.destroy();
		res.redirect('/');
	});

	router.post('/authenticate', function(req, res) {
		var data = {};

		req.pipe(req.busboy);
		req.busboy.on('field', function(key, val, keyTruncated, valueTruncated) {
			data[key] = val;
		});

		req.busboy.on('finish', function() {
			var client = new Client();
			client.post(req.app.get('api-host') + "/api/user/authenticate", {
				data: querystring.stringify(data),
				headers: {"Content-Type": "application/x-www-form-urlencoded"} 
			}, function(data, response) {
				if(data && data.success) {
					req.session.user = data.result;
					res.redirect('/my');
				} else {
					res.redirect('/');
				}
			});
		});
	});

	router.post('/signup', function(req, res) {
		var data = {};

		req.pipe(req.busboy);
		req.busboy.on('field', function(key, val, keyTruncated, valueTruncated) {
			data[key] = val;
		});

		req.busboy.on('finish', function() {
			console.log(JSON.stringify(data))

			var client = new Client();
			client.post(req.app.get('api-host') + "/api/user/add", {
				data: querystring.stringify(data),
				headers: {"Content-Type": "application/x-www-form-urlencoded"} 
			}, function(data, response) {
				if(data && data.success) {
					res.redirect('/my');
				} else {
					res.redirect('/');
				}
			});
		});
	});