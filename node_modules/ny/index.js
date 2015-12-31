var	CScanner = require('./lib/controller-scanner'), 
	MScanner = require('./lib/module-scanner');

var Ny = {
	ControllerScanner : CScanner, 
	ModuleScanner : MScanner
}

module.exports = Ny;