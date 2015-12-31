var express 	= require('express'), 
	request 	= require('request'), 
	fs 			= require('fs'), 
	FormData 	= require('form-data'), 
	http 		= require('http'), 
	url 		= require('url'),
	getResource = function(urls, results, done, i) {
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

	router.all("/*", function(req, res, next) {
		if(!req.session.user) res.redirect('/');
		next();
	})

	router.get('/', function(req, res) {
		var url = req.app.get('api-host') + "/api/catalog/";
		request(url, function(error, response, catalogs) {
			if(!error && response.statusCode != 404) {
				catalogs = JSON.parse(catalogs);

				res.render('AllCatalog', {
					user : req.session.user,
					catalogs : catalogs
				});
			}
		});
	});

	router.get('/import', function(req, res) {
		res.render('ImportCatalog', {
			user : req.session.user
		});
	});

	router.post('/import/ddi', function(req, res) {
		var apiUrl = url.parse(req.app.get('api-host'));
		
		req.pipe(req.busboy);
		req.busboy.on('file', function (fieldname, file, filename) {
			var form = new FormData();
			form.append(fieldname, file, {filename: filename});
			
			var request = http.request({
				method: 'POST',
				host: apiUrl.hostname,
				port: apiUrl.port ? apiUrl.port : '80',
				path: '/api/catalog/import/ddi',
				headers: form.getHeaders()
			}, function(resp) {
				resp.pipe(res)
			});

			form.pipe(request);
		});
	});

	router.get('/:catalogId', function(req, res) {
		var url = req.app.get('api-host') + "/api/catalog/" + req.params.catalogId;
		request(url, function(error, response, detail) {
			if(!error && (response.statusCode != 404 || response.statusCode != 500)) {
				detail = JSON.parse(detail);

				var urls = [];
				for (var i = 0; i < detail.resources.length; i++) {
					urls.push(req.app.get('api-host') + "/api/resource/" + detail.resources[i]);
				}

				getResource(urls, {}, function(resources) {
					detail.ddi.resources = resources;

					res.render('DetailCatalog', {
						user : req.session.user,
						detail : detail
					});
				});
			}
		});
	});

	router.get('/:catalogId/thumb', function(req, res) {
		request(req.app.get('api-host') + "/api/catalog/" + req.params.catalogId + "/thumb").pipe(res);
	});
	
	router.post('/:catalogId/thumb/update', function(req, res) {
		var apiUrl = url.parse(req.app.get('api-host'));
		
		req.pipe(req.busboy);
		req.busboy.on('file', function (fieldname, file, filename) {
			var form = new FormData();
			form.append(fieldname, file, {filename: filename});
			
			var request = http.request({
				method: 'POST',
				host: apiUrl.hostname,
				port: apiUrl.port ? apiUrl.port : '80',
				path: '/api/catalog/' + req.params.catalogId + '/thumb/update',
				headers: form.getHeaders()
			}, function(resp) {
				resp.pipe(res)
			});

			form.pipe(request);
		});
	});