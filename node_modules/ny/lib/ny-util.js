var fs = require('fs'), 
	path = require('path');

var Util = module.exports = {
	find : function(dir, pattern, level) {
            if(level === undefined) level = 1;

		var files = [];
		fs.readdirSync(dir).forEach(function(file) {
			filePath = path.resolve(dir, file);
                  stat = fs.lstatSync(filePath);
                  if (stat.isDirectory()) {
                        if(level > 0) {
                        	var subFiles = Util.find(filePath, pattern, level-1);
                        	files = files.concat(subFiles);
                        }
                  } else {
                  	if(file.indexOf(pattern) > 0) {
                  		files.push({
                                    name : file.split('.')[0], 
                                    path : filePath
                              });
                  	}
                  }
		});

		return files;
	}
}