var express 	= require('express'), 
	request 	= require('request'), 
	fs 			= require('fs'), 
	FormData 	= require('form-data'), 
	http 		= require('http'), 
	url 		= require('url'),
	multer  	= require('multer');

var router = module.exports = express.Router({mergeParams: true});
	router.url = '/resource';

	router.all("/*", function(req, res, next) {
		if(!req.session.user) res.redirect('/');
		next();
	})

	router.get('/', function(req, res) {
		var url = req.app.get('api-host') + "/api/resource/";
		request(url, function(error, response, catalogs) {
			if(!error && response.statusCode != 404) {
				res.render('AllResource', {
					user : req.session.user,
					catalogs : catalogs
				});
			}
		});
	});

	router.get('/:resId', function(req, res) {
		var queries = [];
		var keys = Object.keys(req.query);
		for(var q=0; q<keys.length; q++) {
			queries.push(
				keys[q] + "=" + req.query[keys[q]]
			);
		}

		var strQuery = queries.length==0 ? "" : "?" + queries.join("&");

		var url = req.app.get('api-host') + "/api/resource/" + req.params.resId;
		request(url, function(error, response, resource) {
			resource = JSON.parse(resource);

			if(!error && (response.statusCode != 404 || response.statusCode != 500)) {
				var url = req.app.get('api-host') + "/api/catalog/" + resource.catalogId;
				request(url, function(error, response, catalog) {
					if(!error && (response.statusCode != 404 || response.statusCode != 500)) {
						resource["catalog"] = JSON.parse(catalog);
					}

					var url = req.app.get('api-host') + "/api/resource/" + resource.id + "/query" + strQuery;
					request(url, function(error, response, result) {
						if(!error && (response.statusCode != 404 || response.statusCode != 500)) {
							resource["result"] = JSON.parse(result);

							res.render('DetailResource', {
								user : req.session.user,
								resource : resource
							});
						}
					});
				});
			}
		});
	});

	router.get('/:resId/build', function(req, res) {
		var url = req.app.get('api-host') + "/api/resource/" + req.params.resId;
		request(url, function(error, response, resource) {
			resource = JSON.parse(resource);

			if(!error && (response.statusCode != 404 || response.statusCode != 500)) {
				var url = req.app.get('api-host') + "/api/catalog/" + resource.catalogId;
				request(url, function(error, response, catalog) {
					if(!error && (response.statusCode != 404 || response.statusCode != 500)) {
						resource["catalog"] = JSON.parse(catalog);
					}

					res.render('ResourceBuilder', {
						user : req.session.user,
						resource : resource
					});
				});
			}
		});
	});

	var upload = multer();
	router.post('/:resId/import/dbf', function(req, res) {
		var apiUrl = url.parse(req.app.get('api-host'));
		
		req.pipe(req.busboy);
		req.busboy.on('file', function (fieldname, file, filename) {
			var form = new FormData();
			form.append(fieldname, file, {filename: filename});

			var request = http.request({
				method: 'POST',
				host: apiUrl.hostname,
				port: apiUrl.port ? apiUrl.port : '80',
				path: '/api/resource/'+ req.params.resId +'/import/dbf/zip',
				headers: form.getHeaders()
			}, function(resp) {
				resp.pipe(res)
			});

			form.pipe(request);
		});
	});

	router.get('/:resId/import', function(req, res) {
		var url = req.app.get('api-host') + "/api/resource/" + req.params.resId;
		request(url, function(error, response, resource) {
			resource = JSON.parse(resource);

			if(!error && (response.statusCode != 404 || response.statusCode != 500)) {
				var url = req.app.get('api-host') + "/api/catalog/" + resource.catalogId;
				request(url, function(error, response, catalog) {
					if(!error && (response.statusCode != 404 || response.statusCode != 500)) {
						resource["catalog"] = JSON.parse(catalog);

						res.render('ImportResource', {
							user : req.session.user,
							resource : resource
						});
					}
				});
			}
		});
	});
