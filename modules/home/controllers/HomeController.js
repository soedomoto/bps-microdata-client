var express = require('express');

var router = module.exports = express.Router({mergeParams: true});
	router.url = '/';

	router.get('/', function(req, res) {
		res.render('HomeIndex');
	});