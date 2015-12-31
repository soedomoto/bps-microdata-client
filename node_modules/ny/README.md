Ny - a minimalistic middleware to make nested modular ExpressJS MVC
======================================================================
Ny is an abbreviation of NodeYii. Inspired by Yii capabilities to create modular MVC

What's awesome about Ny?
------------------------
* It can create unlimited level modular ExpressJS MVC
* Each module (at every level) is an ExpressJS application
* Each module can contains own controllers and views

How do I use Ny?
----------------
Create structures look like it :

	ExpressApp
	|-- modules
	|-- |-- Module1.js
	|-- |-- controllers
	|-- |-- |-- Controller11.js
	|-- |-- views
	|-- |-- modules
	|-- |-- |-- Module2.js
	|-- |-- |-- controllers
	|-- |-- |-- |-- Controller21.js
	|-- |-- |-- views
	|-- index.js

Write this code and let Ny search for all modules and it's controllers and views : 

	var MScanner = require('ny').ModuleScanner;
	MScanner.scan(__dirname).apply(app);

Your module should be an instance of express :

	var express = require('express'), 
		path = require('path');

	var router = module.exports = express();
		router.engine('ejs', require('ejs-locals'));
		router.set('view engine', 'ejs');
		router.url = '/admin';

Your controller should be an instance of express router : 

	var express = require('express');

	var router = module.exports = express.Router({mergeParams: true});
		router.url = '/'

		router.get('/', function(req, res) {
			res.render('HomeIndex')
		});

		router.post('/', function(req, res) {
			res.render('HomeIndex')
		});