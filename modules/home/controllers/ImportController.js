var express = require('express'), 
	request = require('request');

var router = module.exports = express.Router({mergeParams: true});
	router.url = '/import';

	router.get('/', function(req, res) {
		it = 234;

		// Iterate over catalog ID
		url = 'http://microdata.bps.go.id/mikrodata/index.php/catalog/'+ it +'/data_dictionary';
		request(url, function(error, response, htmlCatalogDict) {
			if(!error && response.statusCode != 404) {
				// Iterate over data dictiionary in each catalog ID
				$(htmlCatalogDict).find('ul.data-items li.sub-item a').each(function () {
					request($(this).attr('href'), function(error, response, htmlFileDict) {
						res.write($(this).attr('href'))
					});
				});

				res.end()
			}
		});
	});