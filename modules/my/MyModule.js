var express = require('express'), 
	path = require('path');

var router = module.exports = express();
	router.engine('ejs', require('ejs-locals'));
	router.set('view engine', 'ejs');
	router.url = '/my';