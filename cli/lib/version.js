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


module.exports = function(version){

	console.log(`
 ${chalk.red(str)}
 $ ${chalk.blue('@tenp/cli')}        v${version}`);

	try{
		
		if(package.dependencies){
			console.log('  --dependencies')
			if(getDep('@tenp/core')){
				console.log(` $ ${chalk.blue('@tenp/core')}       v${getDep('@tenp/core')}`)
			}
			if(getDep('express')){
				console.log(` $ ${chalk.blue('express')}          v${getDep('express')}`)
			}
			if(getDep('typescript')){
				console.log(` $ ${chalk.blue('typescript')}       v${getDep('typescript')}`)
			}
			if(getDep('formidable')){
				console.log(` $ ${chalk.blue('formidable')}       v${getDep('formidable')}`)
			}
		}
		if(package.devDependencies){
			console.log('  --devDependencies')
			if(getDev('@types/node')){
				console.log(` $ ${chalk.blue('@types/node')}      v${getDev('@types/node')}`)
			}
			if(getDev('@types/express')){
				console.log(` $ ${chalk.blue('@types/express')}   v${getDev('@types/express')}`)
			}
		}
		console.log(' ')
		// console.log(package)
	}catch(e){

	}

}