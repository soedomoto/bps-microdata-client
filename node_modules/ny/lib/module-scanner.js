var path = require('path'), 
	fs = require('fs'), 
	Util = require('./ny-util'), 
	CScanner = require('./controller-scanner');

var Scanner = {
	scan : function(dir, callback) {
		var self = this;
		self.moduleDir = path.join(dir, 'modules');

		self.apply = function(app) {
			Scanner.app = app;
			Scanner.scanRec(self.moduleDir, app, function(err, module) {
				console.log('- ' + module.n + ' is mounted in ' + module.url)
				CScanner.scan(module.baseDir).apply(module);
			});
		}

		return self;
	}, 

	scanRec : function(moduleDir, moduleParent, callback) {
		var self = this;
		fs.exists(moduleDir, function(exists) {
			if(exists) {
				var files = Util.find(moduleDir, 'Module', 1);
				files.forEach(function(file) {
					var module = require(file.path);
					module.baseDir = path.dirname(file.path);
					module.n = file.name;
					module.set('views', path.join(module.baseDir, 'views'));
					
					if(module.url && moduleParent) {
						if(moduleParent.url) {
							module.url = moduleParent.url + module.url;
						}

						callback(null, module);
						Scanner.app.use(module.url, module)
					} else {
						callback(null, module);
						Scanner.app.use(module)
					}

					Scanner.scanRec(path.join(module.baseDir, 'modules'), module, callback);
				});
			}
		});
	}
}


module.exports = Scanner;