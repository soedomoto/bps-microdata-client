var express = require('express'), 
	request = require('request'), 
	fs 		= require('fs');

var router = module.exports = express.Router({mergeParams: true});
	router.url = '/resource';

	router.get('/', function(req, res) {
		var url = "http://localhost:8080/api/resource/";
		request(url, function(error, response, catalogs) {
			if(!error && response.statusCode != 404) {
				res.render('AllResource', {
					catalogs : catalogs
				});
			}
		});
	});

	router.get('/:resId', function(req, res) {
		var url = "http://localhost:8080/api/resource/" + req.params.resId;
		request(url, function(error, response, resource) {
			resource = JSON.parse(resource);

			if(!error && (response.statusCode != 404 || response.statusCode != 500)) {
				var url = "http://localhost:8080/api/catalog/" + resource.catalogId;
				request(url, function(error, response, catalog) {
					if(!error && (response.statusCode != 404 || response.statusCode != 500)) {
						resource["catalog"] = JSON.parse(catalog);
					}

					var url = "http://localhost:8080/api/resource/" + resource.id + "/query";
					request(url, function(error, response, result) {
						if(!error && (response.statusCode != 404 || response.statusCode != 500)) {
							resource["result"] = JSON.parse(result);

							res.render('DetailResource', {
								resource : resource
							});
						}
					});
				});
			}
		});
	});

	router.get('/:resId/import', function(req, res) {
		var url = "http://localhost:8080/api/resource/" + req.params.resId;
		request(url, function(error, response, resource) {
			resource = JSON.parse(resource);

			if(!error && (response.statusCode != 404 || response.statusCode != 500)) {
				var url = "http://localhost:8080/api/catalog/" + resource.catalogId;
				request(url, function(error, response, catalog) {
					if(!error && (response.statusCode != 404 || response.statusCode != 500)) {
						resource["catalog"] = JSON.parse(catalog);

						res.render('ImportResource', {
							resource : resource
						});
					}
				});
			}
		});
	});