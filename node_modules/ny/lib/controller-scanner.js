var Step = require('step'), 
	path = require('path'), 
	fs = require('fs'), 
	Util = require('./ny-util');

var Scanner = {
	scan : function(dir, callback) {
		var self = this;
		self.controllerDir = path.join(dir, 'controllers');

		self.apply = function(app) {
			Scanner.scanRec(self.controllerDir, app, function(err, controller) {
				console.log('-- ' + app.n + '.' + controller.n + ' is mounted in ' + controller.url)
			});
		}

		return self;
	}, 

	scanRec : function(controllerDir, app, callback) {
		var self = this;
		fs.exists(controllerDir, function(exists) {
			if(exists) {
				var files = Util.find(controllerDir, 'Controller', 0);
				files.forEach(function(file) {
					var controller = require(file.path);
					controller.baseDir = path.dirname(file.path);
					controller.n = file.name;

					if(controller.url && app) {
						app.use(controller.url, controller)
					} else {
						app.use(controller)
					}

					callback(null, controller);
				});
			}
		});
	}
}


module.exports = Scanner;