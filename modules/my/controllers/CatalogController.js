var express = require('express'), 
	request = require('request'), 
	fs 		= require('fs');

var getResource = function(urls, results, done, i) {
	if(i == undefined) i = 0;
	if(i == urls.length) return done(results);

	request(urls[i], function(error, response, resource) {
		if(!error && (response.statusCode != 404 || response.statusCode != 500)) {
			results[urls[i]] = resource;
			getResource(urls, results, done, i+1)
		}
	});
}

var router = module.exports = express.Router({mergeParams: true});
	router.url = '/catalog';

	router.get('/', function(req, res) {
		var url = "http://localhost:8080/api/catalog/";
		request(url, function(error, response, catalogs) {
			if(!error && response.statusCode != 404) {
				catalogs = JSON.parse(catalogs);
				for (var i = 0; i < catalogs.length; i++) {
					catalogs[i].thumb = "http://localhost:8080/api/catalog/" + catalogs[i].id + "/thumb";
				};

				res.render('AllCatalog', {
					catalogs : catalogs
				});
			}
		});
	});

	router.get('/import', function(req, res) {
		res.render('ImportCatalog');
	});

	router.get('/:catalogId', function(req, res) {
		var url = "http://localhost:8080/api/catalog/" + req.params.catalogId;
		request(url, function(error, response, detail) {
			if(!error && (response.statusCode != 404 || response.statusCode != 500)) {
				detail = JSON.parse(detail);
				detail.thumb = "http://localhost:8080/api/catalog/" + req.params.catalogId + "/thumb";

				var urls = [];
				for (var i = 0; i < detail.resources.length; i++) {
					urls.push("http://localhost:8080/api/resource/" + detail.resources[i]);
				}

				getResource(urls, {}, function(resources) {
					detail.ddi.resources = resources;

					res.render('DetailCatalog', {
						detail : detail
					});
				});
			}
		});
	});

	router.get('/:catalogId/thumb', function(req, res) {
		request("http://localhost:8080/api/catalog/" + req.params.catalogId + "/thumb").pipe(res);
	});