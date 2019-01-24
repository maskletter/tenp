const chalk = require('chalk');
const { readJson } = require('./tool.js');
const cwd = process.cwd();

const str = `
   --------------------
   --------------------
           ----       
           ----                             ┗|｀O′|┛ ~~tenp-% 
           ----       ---------------------------- 
           ----           ---------------------------- 
           ----               ----------------------------    
           ----                   ----------------------------  
           ----             
           ----   
`

module.exports = function(version){

	console.log(`
 ${chalk.red(str)}
 $ ${chalk.blue('@tenp/cli')}        v${version}`);

	try{
		const package = readJson(cwd, 'package.json');
		if(package.dependencies){
			console.log('  --dependencies')
			if(package.dependencies['@tenp/core']){
				console.log(` $ ${chalk.blue('@tenp/core')}       v${package.dependencies['@tenp/core']}`)
			}
			if(package.dependencies['express']){
				console.log(` $ ${chalk.blue('express')}          v${package.dependencies['express']}`)
			}
			if(package.dependencies['typescript']){
				console.log(` $ ${chalk.blue('typescript')}       v${package.dependencies['typescript']}`)
			}
			if(package.dependencies['formidable']){
				console.log(` $ ${chalk.blue('formidable')}       v${package.dependencies['formidable']}`)
			}
		}
		if(package.devDependencies){
			console.log('  --devDependencies')
			if(package.devDependencies['@types/node']){
				console.log(` $ ${chalk.blue('@types/node')}      v${package.devDependencies['@types/node']}`)
			}
			if(package.devDependencies['@types/express']){
				console.log(` $ ${chalk.blue('@types/express')}   v${package.devDependencies['@types/express']}`)
			}
		}
		// console.log(package)
	}catch(e){

	}

}