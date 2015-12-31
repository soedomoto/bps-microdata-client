var express = require('express');

var router = module.exports = express.Router({mergeParams: true});
	router.url = '/';

	router.all("/*", function(req, res, next) {
		if(!req.session.user) res.redirect('/');
		next();
	})

	router.get('/', function(req, res) {
		res.render('MyIndex', {
			user : req.session.user
		});
	});