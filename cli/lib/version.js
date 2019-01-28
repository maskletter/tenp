const chalk = require('chalk');
const { readJson, cwd } = require('./tool.js');

const str = `
		   _/                                   
	_/_/_/_/    _/_/    _/_/_/    _/_/_/    
	 _/      _/_/_/_/  _/    _/  _/    _/   
	_/      _/        _/    _/  _/    _/    
	 _/_/    _/_/_/  _/    _/  _/_/_/       
	                          _/            
	                         _/    ┗|｀O′|┛ ~~tenp-%  
`
const package = readJson(cwd, 'package.json');

function getDep(name){
	return package.dependencies[name]
}
function getDev(name){
	return package.devDependencies[name];
}
function consoler(name, fun){
	fun = fun || getDep;
	if(fun(name)){
		console.log(` $ ${chalk.blue(name)}       v${fun(name)}`)
	}
}

module.exports = function(version){

	console.log(`
 ${chalk.red(str)}
 $ ${chalk.blue('@tenp/cli')}        v${version}`);

	try{
		
		if(package.dependencies){
			console.log('  --dependencies')
		
			consoler('@tenp/core');
			consoler('express');
			consoler('typescript');
			consoler('formidable');
			
		}
		if(package.devDependencies){
			console.log('  --devDependencies')
			consoler('@types/node', getDev)
			consoler('@types/express', getDev)
		}
		console.log(' ')
		// console.log(package)
	}catch(e){

	}

}