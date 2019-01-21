/**
 * [控制生产环境的启动]
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
const PM2Lib = require('pm2/lib/API.js');
const Logs = require('pm2/lib/API/Log.js');
const tabtab = require('pm2/lib/completion.js');
const { spawn } = require('child_process')
const path = require('path');
const cwd = process.cwd();
const fs = require('fs');
const ts = require("typescript");
const { con, extendTenpConfig, getEnv, readJson } = require('./tool.js');
const numCPUs = require('os').cpus().length;
const tsconfig = readJson(cwd, 'tsconfig.json')
const packConfig = function(){
  let result = readJson(cwd, 'package.json')
  result.tenp = extendTenpConfig(result.tenp);
  return result
}()

const pm2 = new PM2Lib();


module.exports.start = function(argv){
	if(!tsconfig.compilerOptions) return con.error('\r\n $ 未发现tsconfig配置文件');

	const outDir = path.join(cwd, tsconfig.compilerOptions.outDir);
	

	if(argv.indexOf('--build') != -1){
		const spwan = spawn(process.platform === "win32" ? "npm.cmd" : "npm", ['run', 'dev:build'], {
	      cwd: cwd,
	      stdio: 'inherit',
	      shell: true,
	    })
	    spwan.on('exit', () => {
	      start();
	    })
	}else{
		if(!fs.existsSync(outDir)){
			con.error(`\r\n  $ 未发现${outDir}目录`)
			return;
		}
		start();
	}

	function start(){
		let options = packConfig.tenp.pm2;
		if(argv.indexOf('-i') != -1){
			options.execMode = 'cluster';
			if(isNaN(argv[argv.indexOf('-i')+1])){
				options.instances = numCPUs;
			}else{
				options.instances = argv[argv.indexOf('-i')+1];
			}
		}
		options.env = getEnv(packConfig.tenp.env, 'build') || {}
		if(packConfig.tenp.createUrlPath == true || process.argv.indexOf('--url') != -1){
	        options.env.createUrlPath = true;
	    }
		
		pm2.connect(function(err) {
		  if (err) {
		    console.error(err)
		    process.exit(2)
		  }
		  pm2.start(path.join(outDir, packConfig.main),options, function(err, apps, next){
	  		if(err) {  
	  			pm2.speedList(err ? 1 : 0);
	  		}
	  		else{
	  			pm2.speedList(err ? 1 : 0);
	  		}
		  })
		
		})
	}
		
}

module.exports.list = function(){
	pm2.list();
}

module.exports.stop = function(name){
	pm2.stop(name, function(err, result){
		if(err){ console.log(err) }
		else{ console.log('服务停止成功') }
		process.exit();
	})
}

module.exports.disconnect = function(){
	pm2.disconnect();
	process.exit();
}

module.exports.describe = function(name){
	pm2.describe(name)
}

module.exports.reload = function(name){
	pm2.reload(name, function(err, result){
		if(err){ console.log(err) }
		else{ console.log('服务重启完成') }
		process.exit();
	})
}

module.exports.kill = function(){
	pm2.disconnect();
	pm2.killDaemon(function(){
		process.exit();
	})
}

module.exports.log = function(argv){

	name = argv[0] && argv[0].substring(0, 2) == '--' ? 'all' : argv[0];
    var line = 15;
    var raw  = false;
    var exclusive = false;
    var timestamp = false;
    if(argv.indexOf('--timestamp') != -1){
    	timestamp = 'YYYY-MM-DD-HH:mm:ss';
    }
    if(argv.indexOf('--out') != -1){
    	exclusive = 'out';
    }
    if(argv.indexOf('--err') != -1){
    	exclusive = 'err';
    }

    if (argv.indexOf('--nostream') != -1)
      pm2.printLogs(name, line, raw, timestamp, exclusive);
    else if (argv.indexOf('--json') != -1)
      Logs.jsonStream(pm2.Client, name);
    else if (argv.indexOf('--format') != -1)
      Logs.formatStream(pm2.Client, name, false, 'YYYY-MM-DD-HH:mm:ssZZ');
    else
      pm2.streamLogs(name, line, raw, timestamp, exclusive);

}