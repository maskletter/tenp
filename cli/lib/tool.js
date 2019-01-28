const chalk = require('chalk');
const notifier = require('node-notifier');
const path = require('path');

const DefaultTenpConfig = {
	env: {
		dev: {
			kvl_status: 'dev',
			kvl_version: require('../package.json').version
		},
		build: {
			kvl_status: 'build',
			kvl_version: require('../package.json').version
		}
	},
	pm2: {

	}
}

//dev/serve模式关键字
const DevKeyword = ['--mode','--build', '--url']

const tool = {

	cwd: process.cwd(),

	npm_cmd: process.platform === "win32" ? "npm.cmd" : "npm",

	os: process.env.PATH.toLocaleLowerCase().indexOf('window') != -1 ? 'window' : 'all',

	getPackConfig: function(){
		let result = tool.readJson(tool.cwd, 'package.json')
	    result.tenp = tool.extendTenpConfig(result.tenp);
	    return result
	},

	extendTenpConfig: function(config){
		let kvlConfig = Object.assign(DefaultTenpConfig, config);
		if(process.argv.indexOf('---url')){
			kvlConfig.createUrlPath = true;
		}
		return kvlConfig;
	},	

	sendSystemMessage: function(title, message){
		notifier.notify(
	      {
	        title,
	        message,
	        sound: true, 
	        wait: true 
	      },
	      function(err, response) {
	        // Response is response from notification
	      }
	    );
	    
	    notifier.on('click', function(){
	      // console.log(notifierObject)
	      // console.log(options)
	      // exec('start http://www.baidu.com');
	    })

	},

	getEnv: function(env, mode){
		const index = process.argv.indexOf('--mode');
		if(process.argv.indexOf('--mode') != -1 && DevKeyword.indexOf(process.argv[index+1]) == -1){
			return env[process.argv[index+1]] || {};
		}else{
			return env[mode];
		}
	},

	readJson: function(cwd, name){
		try {
			return require(path.join(tool.cwd,name))
		} catch(e) {
			return {};
		}
	},

	con: {
		error: function(data){
			console.log(`${chalk.red(data)}`)
		},

		success: function(data){
			console.log(`${chalk.green(data)}`)
		},

		log: function(data){
			console.log(data)
		},

		yellow: function(data){
			console.log(`${chalk.yellow(data)}`)
		}
	}
}

module.exports = tool;