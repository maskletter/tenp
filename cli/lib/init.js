
const { execFile, spawn, fork } = require('child_process')
const path = require('path');
const fs = require('fs');
const npm = (process.platform === "win32" ? "npm.cmd" : "npm");
const Global_Pack = require('../package.json');
let directoryPath = process.cwd();
const readline = require('readline');
const validate = require("validate-npm-package-name")
const { con } = require('./tool.js');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function readlinePromise(name){
	return new Promise((resolve, reject) => {
		rl.question(name, answer => {
			resolve(answer)
		});
	})
}

//生成package.json
async function createPackage(name){
	console.log('create init')
	let pacakge = {};
	pacakge.name = await readlinePromise(`  package name: (${name})`) || name;
	const validateresult = validate(pacakge.name);
	if(!validateresult.validForNewPackages || !validateresult.validForOldPackages){
		console.log('')
		validateresult.errors[0] && con.error(validateresult.errors[0])
		validateresult.errors[1] && con.error(validateresult.errors[1])
		console.log('')
		process.exit();
	}
	pacakge.version = await readlinePromise('  version: (1.0.0)') || '1.0.0';
	pacakge.description = await readlinePromise('  description:') || {};
	pacakge.main = await readlinePromise('  entry point: (server.js)') || 'server.js';
	const testCommand = await readlinePromise('  test command:');
	const gitRepository = await readlinePromise('  git repository:');
	pacakge.keywords = await readlinePromise('  keywords:');
	pacakge.author = await readlinePromise('  author:');
	pacakge.license = await readlinePromise('  license: (ISC)') || "ISC";

	pacakge.keywords = pacakge.keywords.split(' ');

	if(gitRepository){
		pacakge.repository = {
		    "type": "git",
		    "url": "git+"+gitRepository
		}
	}
	if(testCommand){
		pacakge.scripts = {
			 "test": testCommand
		}
	}else{
		pacakge.scripts = {
			"dev": "tenp dev",
    		"dev:build": "tenp dev --build",
    		"serve": "tenp serve",
    		"serve:build": "tenp serve --build",
			"test": "echo \"Error: no test specified\" && exit 1"
		}
	}


	con.log('关于生成的 package.json 信息:')
	con.yellow(JSON.stringify(pacakge, null, 4))

	const isCreate = await readlinePromise(`  Is this OK? (yes) `);

	return { pacakge, isCreate };
}


function installPack(){
	const ff = require('./install.js')(directoryPath, null);
	ff.then(result => {
		console.log(' 创建成功')
		console.log('')
		process.exit()
	}).catch(err => {
	    console.log(err)
	})
}

function createAssets(isNo){
	const filename = isNo ? 'server-demo.txt' : 'server.txt';
	const content = fs.readFileSync(path.resolve(__dirname,'../dist/'+filename));
	const src = path.join(directoryPath, 'src');
	const exists = fs.existsSync(src);
	if(!exists){
		fs.mkdirSync(path.resolve(src));
	}
	
	fs.writeFileSync(path.resolve(directoryPath, 'src', 'server.ts'), content.toString());

}

function consoleVersion(){
	console.log('version:  ')
	console.log('  @tenp/core:'+Global_Pack.version);
	console.log('  express: ^4.16.4')
	console.log('  typescript: ^3.2.2');
	console.log('  @types/node: 10.11.2');
	console.log('  @types/express: ^4.16.0')
	console.log('  formidable: 1.2.1');
	console.log('')
}


module.exports = function(argv){

	const isNo = argv.indexOf('--no') == -1 ? false : true;
	argv = argv.filter(v => v != '--no');
	const name = argv[0];

	directoryPath = path.join(process.cwd(), name);
	if(fs.existsSync(directoryPath)){
		con.error('\r\n $ 已存在项目目录')
		process.exit();
		return;
	}

	console.log(`\r\n开始生成项目:${name}`)
	if(!isNo){
		consoleVersion();
	}

	createPackage(name).then(({ pacakge, isCreate }) => {
		if(!isCreate || isCreate == 'yes' || isCreate == 'y'){
			fs.mkdirSync(directoryPath);
			if(!isNo){
				pacakge.devDependencies = {
		    		"@types/node": "^10.11.2",
	    			"@types/express": "^4.16.0"
				}
				pacakge.dependencies = {
					"formidable": "^1.2.1",
					"express": "^4.16.4",
					"typescript": "^3.2.2",
		    		"@tenp/core": "^"+Global_Pack.version
				}
			}
				
			fs.writeFile(path.resolve(directoryPath, 'package.json'), JSON.stringify(pacakge, null, 2), function(err){
				if(err){
					con.error(err)
				}else{
					createAssets(isNo);
					const tsconfig = require(path.resolve(__dirname,'../dist/tsconfig.json'))
					fs.writeFileSync(path.resolve(directoryPath,'tsconfig.json'), JSON.stringify(tsconfig, null, 2));
					
					if(!isNo){
						readlinePromise('是否自动安装依赖包文件?(y/n)').then(result => {
							if(result == 'y' || !result){
								installPack();
							}else{
								con.success(' 创建成功')
								console.log('')
								process.exit()
							}
						})
					}else{
						con.success(' 创建成功');
						process.exit();
					}

				}
			})
		}else{
			process.exit()
		}
	})

	


}